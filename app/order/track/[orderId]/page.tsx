'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Layout,
  Card,
  Typography,
  Steps,
  List,
  Divider,
  Button,
  Tag,
  Space,
  Spin,
  message,
  Result,
} from 'antd';
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  FireOutlined,
  RocketOutlined,
  SmileOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
} from '@ant-design/icons';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

interface Order {
  _id: string;
  orderNumber: string;
  branchId: { name: string; address: string; phone: string };
  tableId: { tableNumber: string; zone: string };
  items: Array<{
    name: { th: string; en: string };
    quantity: number;
    price: number;
    specialInstructions?: string;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  customerName?: string;
  customerPhone?: string;
}

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();

  const [orderId, setOrderId] = useState<string>('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchParams = async () => {
      const resolvedParams = await params;
      setOrderId(resolvedParams.orderId as string);
    };
    fetchParams();
  }, [params]);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/orders?orderId=${orderId}`);
      const data = await response.json();

      if (data.success) {
        setOrder(data.data);
        setNotFound(false);
      } else {
        setNotFound(true);
        message.error('ไม่พบคำสั่งซื้อ');
      }
    } catch (error) {
      message.error('ไม่สามารถโหลดข้อมูลคำสั่งซื้อได้');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status: string): number => {
    const statusMap: Record<string, number> = {
      pending: 0,
      confirmed: 1,
      preparing: 2,
      ready: 3,
      served: 4,
      cancelled: -1,
    };
    return statusMap[status] ?? 0;
  };

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      pending: 'orange',
      confirmed: 'blue',
      preparing: 'cyan',
      ready: 'green',
      served: 'default',
      cancelled: 'red',
    };
    return colors[status] || 'default';
  };

  const getPaymentStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      pending: 'orange',
      paid: 'green',
      failed: 'red',
      refunded: 'purple',
    };
    return colors[status] || 'default';
  };

  const statusSteps = [
    {
      title: 'รอยืนยัน',
      icon: <ClockCircleOutlined />,
      description: 'รอพนักงานยืนยันคำสั่งซื้อ',
    },
    {
      title: 'ยืนยันแล้ว',
      icon: <CheckCircleOutlined />,
      description: 'พนักงานยืนยันคำสั่งซื้อแล้ว',
    },
    {
      title: 'กำลังเตรียม',
      icon: <FireOutlined />,
      description: 'กำลังเตรียมอาหารของคุณ',
    },
    {
      title: 'พร้อมเสิร์ฟ',
      icon: <RocketOutlined />,
      description: 'อาหารพร้อมเสิร์ฟแล้ว',
    },
    {
      title: 'เสิร์ฟแล้ว',
      icon: <SmileOutlined />,
      description: 'ขอให้รับประทานอาหารอร่อย',
    },
  ];

  if (loading) {
    return (
      <Layout style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Spin size="large" />
      </Layout>
    );
  }

  if (notFound || !order) {
    return (
      <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
        <Content style={{ padding: '24px', maxWidth: 600, margin: '0 auto' }}>
          <Result
            status="404"
            title="ไม่พบคำสั่งซื้อ"
            subTitle="ขอโทษครับ ไม่พบคำสั่งซื้อที่คุณค้นหา"
            extra={
              <Button type="primary" onClick={() => router.push('/')}>
                กลับหน้าหลัก
              </Button>
            }
          />
        </Content>
      </Layout>
    );
  }

  const currentStep = getStatusStep(order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Content style={{ padding: '16px', maxWidth: 800, margin: '0 auto' }}>
        <Card style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <Title level={3} style={{ margin: 0 }}>
                คำสั่งซื้อ #{order.orderNumber}
              </Title>
              <Text type="secondary">
                {new Date(order.createdAt).toLocaleString('th-TH')}
              </Text>
            </div>
            <Button icon={<ReloadOutlined />} onClick={fetchOrder}>
              รีเฟรช
            </Button>
          </div>

          <Space size="middle">
            <Tag color={getStatusColor(order.status)} style={{ fontSize: 14, padding: '4px 12px' }}>
              สถานะ: {order.status.toUpperCase()}
            </Tag>
            <Tag color={getPaymentStatusColor(order.paymentStatus)} style={{ fontSize: 14, padding: '4px 12px' }}>
              ชำระเงิน: {order.paymentStatus.toUpperCase()}
            </Tag>
          </Space>

          <Divider />

          <div style={{ marginBottom: 16 }}>
            <Text strong>สาขา:</Text> {order.branchId.name}
            <br />
            <Text strong>โต๊ะ:</Text> {order.tableId.tableNumber} ({order.tableId.zone})
            {order.customerName && (
              <>
                <br />
                <Text strong>ชื่อลูกค้า:</Text> {order.customerName}
              </>
            )}
            {order.customerPhone && (
              <>
                <br />
                <Text strong>เบอร์โทร:</Text> {order.customerPhone}
              </>
            )}
          </div>

          {isCancelled ? (
            <Result
              status="error"
              title="คำสั่งซื้อถูกยกเลิก"
              subTitle="คำสั่งซื้อของคุณถูกยกเลิกแล้ว กรุณาติดต่อพนักงานหากมีข้อสงสัย"
              icon={<CloseCircleOutlined />}
            />
          ) : (
            <Steps
              current={currentStep}
              items={statusSteps}
              direction="vertical"
              style={{ marginTop: 24 }}
            />
          )}
        </Card>

        <Card title="รายการอาหาร" style={{ marginBottom: 16 }}>
          <List
            dataSource={order.items}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={item.name.th}
                  description={
                    <>
                      <div>
                        ฿{item.price} x {item.quantity} = ฿
                        {(item.price * item.quantity).toFixed(2)}
                      </div>
                      {item.specialInstructions && (
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          หมายเหตุ: {item.specialInstructions}
                        </Text>
                      )}
                    </>
                  }
                />
              </List.Item>
            )}
          />

          <Divider />

          <Space direction="vertical" style={{ width: '100%' }} size="small">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text>ราคารวม:</Text>
              <Text>฿{order.subtotal.toFixed(2)}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text>ภาษี (7%):</Text>
              <Text>฿{order.tax.toFixed(2)}</Text>
            </div>
            <Divider style={{ margin: '8px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text strong style={{ fontSize: 18 }}>
                ยอดรวมสุทธิ:
              </Text>
              <Text strong style={{ fontSize: 20, color: '#ff4d4f' }}>
                ฿{order.total.toFixed(2)}
              </Text>
            </div>
          </Space>
        </Card>

        <Card>
          <Title level={5}>ข้อมูลติดต่อสาขา</Title>
          <Paragraph>
            <Text strong>ที่อยู่:</Text> {order.branchId.address}
            <br />
            <Text strong>โทรศัพท์:</Text> {order.branchId.phone}
          </Paragraph>
        </Card>
      </Content>
    </Layout>
  );
}
