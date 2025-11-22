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
  GlobalOutlined,
} from '@ant-design/icons';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';

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
  const { language, setLanguage, t } = useLanguage();

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

      if (data.success && data.data) {
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
      message.success(`${t('added-to-cart')}: ${selectedItem.name[language]}`);
      setItemModalVisible(false);
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      message.warning(t('select-menu-first'));
      return;
    }
    router.push(`/order/${qrCode}/checkout`);
  };

  const filteredMenuItems = menuItems.filter(
    (item) => item.categoryId._id === activeCategory && item.isAvailable
  );

  const tabItems = categories.map((cat) => ({
    key: cat._id,
    label: cat.name[language],
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Title level={4} style={{ margin: 0, lineHeight: 1.2 }}>
            {tableInfo?.branch.name}
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            {t('table')} {tableInfo?.tableNumber}{tableInfo?.zone ? ` (${tableInfo.zone})` : ''}
          </Text>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Button
            type="text"
            icon={<GlobalOutlined />}
            onClick={() => setLanguage(language === 'th' ? 'en' : 'th')}
            style={{ padding: '4px 8px' }}
          >
            {language === 'th' ? 'EN' : 'TH'}
          </Button>
          <Badge count={itemCount} showZero>
            <Button
              type="primary"
              icon={<ShoppingCartOutlined />}
              onClick={() => setCartDrawerVisible(true)}
              size="large"
            >
              {t('cart')}
            </Button>
          </Badge>
        </div>
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
                      alt={item.name[language]}
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
                      <Text type="secondary">{t('no-image')}</Text>
                    </div>
                  )
                }
              >
                <Card.Meta
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{item.name[language]}</span>
                      {item.isVegetarian && <span>🌱</span>}
                    </div>
                  }
                  description={
                    <>
                      {item.description?.[language] && (
                        <Paragraph
                          ellipsis={{ rows: 2 }}
                          style={{ marginBottom: 8, fontSize: 13 }}
                        >
                          {item.description[language]}
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
              <Empty description={t('no-menu')} />
            </Col>
          )}
        </Row>
      </Content>

      {/* Item Detail Modal */}
      <Modal
        title={selectedItem?.name[language]}
        open={itemModalVisible}
        onCancel={() => setItemModalVisible(false)}
        footer={null}
      >
        {selectedItem && (
          <div>
            {selectedItem.imageUrl && (
              <img
                src={selectedItem.imageUrl}
                alt={selectedItem.name[language]}
                style={{ width: '100%', borderRadius: 8, marginBottom: 16 }}
              />
            )}

            <Paragraph>{selectedItem.description?.[language]}</Paragraph>

            <div style={{ marginBottom: 16 }}>
              <Text strong>{t('price')}: </Text>
              <Text style={{ fontSize: 18, color: '#ff4d4f' }}>฿{selectedItem.price}</Text>
            </div>

            {selectedItem.spicyLevel > 0 && (
              <div style={{ marginBottom: 8 }}>
                <Text strong>{t('spicy')}: </Text>
                {'🌶️'.repeat(selectedItem.spicyLevel)}
              </div>
            )}

            {selectedItem.allergens.length > 0 && (
              <div style={{ marginBottom: 8 }}>
                <Text strong>{t('allergens')}: </Text>
                {selectedItem.allergens.map((allergen) => (
                  <Tag key={allergen} color="orange">
                    {allergen}
                  </Tag>
                ))}
              </div>
            )}

            {selectedItem.isVegetarian && (
              <Tag color="green" style={{ marginBottom: 8 }}>
                🌱 {t('vegetarian')}
              </Tag>
            )}

            <div style={{ marginBottom: 16 }}>
              <Text type="secondary">{t('prep-time')}: ~{selectedItem.preparationTime} {t('minutes')}</Text>
            </div>

            <div style={{ marginBottom: 16 }}>
              <Text strong>{t('quantity')}:</Text>
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
              <Text strong>{t('special-instructions')}:</Text>
              <TextArea
                rows={3}
                placeholder={t('special-instructions-placeholder')}
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
              {t('add-to-cart')} - ฿{(selectedItem.price * itemQuantity).toFixed(2)}
            </Button>
          </div>
        )}
      </Modal>

      {/* Cart Drawer */}
      <Drawer
        title={t('cart-title')}
        placement="right"
        onClose={() => setCartDrawerVisible(false)}
        open={cartDrawerVisible}
        size="default"
        styles={{ body: { width: 400 } }}
        footer={
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text strong style={{ fontSize: 18 }}>{t('total')}:</Text>
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
              {t('checkout')}
            </Button>
          </div>
        }
      >
        {items.length === 0 ? (
          <Empty description={t('cart-empty')} />
        ) : (
          <List
            dataSource={items}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button
                    key="delete"
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeItem(item._id)}
                  />,
                ]}
              >
                <List.Item.Meta
                  title={item.name[language]}
                  description={
                    <>
                      <div>฿{item.price} x {item.quantity}</div>
                      {item.specialInstructions && (
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {t('note')}: {item.specialInstructions}
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
