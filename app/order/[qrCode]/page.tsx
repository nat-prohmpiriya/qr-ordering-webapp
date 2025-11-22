'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Layout,
  Card,
  Row,
  Col,
  Typography,
  Button,
  Badge,
  Tabs,
  InputNumber,
  Tag,
  Modal,
  Input,
  message,
  Drawer,
  List,
  Empty,
  Spin,
} from 'antd';
import {
  ShoppingCartOutlined,
  PlusOutlined,
  MinusOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { useCart } from '@/contexts/CartContext';

const { Header, Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface MenuItem {
  _id: string;
  name: { th: string; en: string };
  description?: { th?: string; en?: string };
  price: number;
  imageUrl?: string;
  spicyLevel: number;
  allergens: string[];
  isAvailable: boolean;
  isVegetarian: boolean;
  preparationTime: number;
  categoryId: { _id: string; name: { th: string; en: string } };
}

interface Category {
  _id: string;
  name: { th: string; en: string };
  description?: { th?: string; en?: string };
}

interface TableInfo {
  tableNumber: string;
  zone: string;
  branch: {
    _id: string;
    name: string;
    slug: string;
  };
}

export default function OrderPage() {
  const params = useParams();
  const router = useRouter();
  const { items, addItem, removeItem, updateQuantity, total, itemCount } = useCart();

  const [qrCode, setQrCode] = useState<string>('');
  const [tableInfo, setTableInfo] = useState<TableInfo | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [cartDrawerVisible, setCartDrawerVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [itemModalVisible, setItemModalVisible] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [itemQuantity, setItemQuantity] = useState(1);

  useEffect(() => {
    const fetchParams = async () => {
      const resolvedParams = await params;
      setQrCode(resolvedParams.qrCode as string);
    };
    fetchParams();
  }, [params]);

  useEffect(() => {
    if (qrCode) {
      fetchTableInfo();
    }
  }, [qrCode]);

  useEffect(() => {
    if (tableInfo) {
      fetchMenuAndCategories();
    }
  }, [tableInfo]);

  const fetchTableInfo = async () => {
    try {
      const response = await fetch(`/api/tables/${qrCode}`);
      const data = await response.json();

      if (data.success) {
        setTableInfo({
          tableNumber: data.data.table.tableNumber,
          zone: data.data.table.zone,
          branch: {
            _id: data.data.branch._id,
            name: data.data.branch.name,
            slug: data.data.branch.slug,
          },
        });
      } else {
        message.error('Invalid QR Code');
        router.push('/');
      }
    } catch (error) {
      message.error('Failed to load table information');
      console.error('Error:', error);
    }
  };

  const fetchMenuAndCategories = async () => {
    try {
      setLoading(true);

      const [menuResponse, categoriesResponse] = await Promise.all([
        fetch(`/api/menu?branchId=${tableInfo?.branch._id}`),
        fetch('/api/categories'),
      ]);

      const menuData = await menuResponse.json();
      const categoriesData = await categoriesResponse.json();

      if (menuData.success && categoriesData.success) {
        setMenuItems(menuData.data || []);
        setCategories(categoriesData.data || []);

        if (categoriesData.data.length > 0) {
          setActiveCategory(categoriesData.data[0]._id);
        }
      }
    } catch (error) {
      message.error('Failed to load menu');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
    setItemQuantity(1);
    setSpecialInstructions('');
    setItemModalVisible(true);
  };

  const handleAddToCart = () => {
    if (selectedItem) {
      addItem({
        _id: selectedItem._id,
        name: selectedItem.name,
        price: selectedItem.price,
        quantity: itemQuantity,
        specialInstructions: specialInstructions || undefined,
      });
      message.success(`เพิ่ม ${selectedItem.name.th} ลงตะกร้าแล้ว`);
      setItemModalVisible(false);
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      message.warning('กรุณาเลือกเมนูก่อนสั่งอาหาร');
      return;
    }
    router.push(`/order/${qrCode}/checkout`);
  };

  const filteredMenuItems = menuItems.filter(
    (item) => item.categoryId._id === activeCategory && item.isAvailable
  );

  const tabItems = categories.map((cat) => ({
    key: cat._id,
    label: cat.name.th,
  }));

  if (loading) {
    return (
      <Layout style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Spin size="large" />
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Header
        style={{
          background: '#fff',
          padding: '0 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #f0f0f0',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
        }}
      >
        <div>
          <Title level={4} style={{ margin: 0 }}>
            {tableInfo?.branch.name}
          </Title>
          <Text type="secondary">
            โต๊ะ {tableInfo?.tableNumber} ({tableInfo?.zone})
          </Text>
        </div>
        <Badge count={itemCount} showZero>
          <Button
            type="primary"
            icon={<ShoppingCartOutlined />}
            onClick={() => setCartDrawerVisible(true)}
            size="large"
          >
            ตะกร้า
          </Button>
        </Badge>
      </Header>

      <Content style={{ padding: '16px' }}>
        <Tabs
          activeKey={activeCategory}
          onChange={setActiveCategory}
          items={tabItems}
          style={{ background: '#fff', padding: '8px 16px', borderRadius: 8, marginBottom: 16 }}
        />

        <Row gutter={[16, 16]}>
          {filteredMenuItems.map((item) => (
            <Col xs={24} sm={12} md={8} lg={6} key={item._id}>
              <Card
                hoverable
                onClick={() => handleItemClick(item)}
                cover={
                  item.imageUrl ? (
                    <img
                      alt={item.name.th}
                      src={item.imageUrl}
                      style={{ height: 200, objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      style={{
                        height: 200,
                        background: '#f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text type="secondary">ไม่มีรูปภาพ</Text>
                    </div>
                  )
                }
              >
                <Card.Meta
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{item.name.th}</span>
                      {item.isVegetarian && <span>🌱</span>}
                    </div>
                  }
                  description={
                    <>
                      {item.description?.th && (
                        <Paragraph
                          ellipsis={{ rows: 2 }}
                          style={{ marginBottom: 8, fontSize: 13 }}
                        >
                          {item.description.th}
                        </Paragraph>
                      )}
                      {item.spicyLevel > 0 && (
                        <div style={{ marginBottom: 4 }}>
                          {'🌶️'.repeat(item.spicyLevel)}
                        </div>
                      )}
                      <Text strong style={{ fontSize: 16, color: '#ff4d4f' }}>
                        ฿{item.price}
                      </Text>
                    </>
                  }
                />
              </Card>
            </Col>
          ))}

          {filteredMenuItems.length === 0 && (
            <Col span={24}>
              <Empty description="ไม่มีเมนูในหมวดนี้" />
            </Col>
          )}
        </Row>
      </Content>

      {/* Item Detail Modal */}
      <Modal
        title={selectedItem?.name.th}
        open={itemModalVisible}
        onCancel={() => setItemModalVisible(false)}
        footer={null}
      >
        {selectedItem && (
          <div>
            {selectedItem.imageUrl && (
              <img
                src={selectedItem.imageUrl}
                alt={selectedItem.name.th}
                style={{ width: '100%', borderRadius: 8, marginBottom: 16 }}
              />
            )}

            <Paragraph>{selectedItem.description?.th}</Paragraph>

            <div style={{ marginBottom: 16 }}>
              <Text strong>ราคา: </Text>
              <Text style={{ fontSize: 18, color: '#ff4d4f' }}>฿{selectedItem.price}</Text>
            </div>

            {selectedItem.spicyLevel > 0 && (
              <div style={{ marginBottom: 8 }}>
                <Text strong>ความเผ็ด: </Text>
                {'🌶️'.repeat(selectedItem.spicyLevel)}
              </div>
            )}

            {selectedItem.allergens.length > 0 && (
              <div style={{ marginBottom: 8 }}>
                <Text strong>สารก่อภูมิแพ้: </Text>
                {selectedItem.allergens.map((allergen) => (
                  <Tag key={allergen} color="orange">
                    {allergen}
                  </Tag>
                ))}
              </div>
            )}

            {selectedItem.isVegetarian && (
              <Tag color="green" style={{ marginBottom: 8 }}>
                🌱 เมนูเจ/มังสวิรัติ
              </Tag>
            )}

            <div style={{ marginBottom: 16 }}>
              <Text type="secondary">เวลาเตรียม: ~{selectedItem.preparationTime} นาที</Text>
            </div>

            <div style={{ marginBottom: 16 }}>
              <Text strong>จำนวน:</Text>
              <div style={{ display: 'flex', alignItems: 'center', marginTop: 8, gap: 8 }}>
                <Button
                  icon={<MinusOutlined />}
                  onClick={() => setItemQuantity(Math.max(1, itemQuantity - 1))}
                />
                <InputNumber
                  min={1}
                  max={99}
                  value={itemQuantity}
                  onChange={(value) => setItemQuantity(value || 1)}
                  style={{ width: 60 }}
                />
                <Button
                  icon={<PlusOutlined />}
                  onClick={() => setItemQuantity(itemQuantity + 1)}
                />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <Text strong>คำขอพิเศษ:</Text>
              <TextArea
                rows={3}
                placeholder="เช่น ไม่ใส่ผัก, เผ็ดน้อย, ฯลฯ"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                style={{ marginTop: 8 }}
              />
            </div>

            <Button
              type="primary"
              block
              size="large"
              icon={<PlusOutlined />}
              onClick={handleAddToCart}
            >
              เพิ่มลงตะกร้า - ฿{(selectedItem.price * itemQuantity).toFixed(2)}
            </Button>
          </div>
        )}
      </Modal>

      {/* Cart Drawer */}
      <Drawer
        title="ตะกร้าสินค้า"
        placement="right"
        onClose={() => setCartDrawerVisible(false)}
        open={cartDrawerVisible}
        width={400}
        footer={
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text strong style={{ fontSize: 18 }}>รวม:</Text>
              <Text strong style={{ fontSize: 20, color: '#ff4d4f' }}>
                ฿{total.toFixed(2)}
              </Text>
            </div>
            <Button
              type="primary"
              size="large"
              block
              onClick={handleCheckout}
              disabled={items.length === 0}
            >
              ยืนยันและสั่งอาหาร
            </Button>
          </div>
        }
      >
        {items.length === 0 ? (
          <Empty description="ตะกร้าว่างเปล่า" />
        ) : (
          <List
            dataSource={items}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeItem(item._id)}
                  />,
                ]}
              >
                <List.Item.Meta
                  title={item.name.th}
                  description={
                    <>
                      <div>฿{item.price} x {item.quantity}</div>
                      {item.specialInstructions && (
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          หมายเหตุ: {item.specialInstructions}
                        </Text>
                      )}
                    </>
                  }
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Button
                    size="small"
                    icon={<MinusOutlined />}
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  />
                  <Text>{item.quantity}</Text>
                  <Button
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  />
                </div>
              </List.Item>
            )}
          />
        )}
      </Drawer>
    </Layout>
  );
}
