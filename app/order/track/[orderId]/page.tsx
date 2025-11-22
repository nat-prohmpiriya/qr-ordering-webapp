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
  GlobalOutlined,
} from '@ant-design/icons';
import { useLanguage } from '@/contexts/LanguageContext';

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
  const { language, setLanguage, t } = useLanguage();

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
        message.error(t('order-not-found'));
      }
    } catch (error) {
      message.error(t('order-error'));
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
      title: t('step-pending-title'),
      icon: <ClockCircleOutlined />,
      description: t('step-pending-desc'),
    },
    {
      title: t('step-confirmed-title'),
      icon: <CheckCircleOutlined />,
      description: t('step-confirmed-desc'),
    },
    {
      title: t('step-preparing-title'),
      icon: <FireOutlined />,
      description: t('step-preparing-desc'),
    },
    {
      title: t('step-ready-title'),
      icon: <RocketOutlined />,
      description: t('step-ready-desc'),
    },
    {
      title: t('step-served-title'),
      icon: <SmileOutlined />,
      description: t('step-served-desc'),
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
            title={t('order-not-found')}
            subTitle={t('order-not-found-subtitle')}
            extra={
              <Button type="primary" onClick={() => router.push('/')}>
                {t('back-home')}
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
                {t('order-details')} #{order.orderNumber}
              </Title>
              <Text type="secondary">
                {new Date(order.createdAt).toLocaleString(language === 'th' ? 'th-TH' : 'en-US')}
              </Text>
            </div>
            <Space>
              <Button
                type="text"
                icon={<GlobalOutlined />}
                onClick={() => setLanguage(language === 'th' ? 'en' : 'th')}
              >
                {language === 'th' ? 'EN' : 'TH'}
              </Button>
              <Button icon={<ReloadOutlined />} onClick={fetchOrder}>
                {t('refresh')}
              </Button>
            </Space>
          </div>

          <Space size="middle">
            <Tag color={getStatusColor(order.status)} style={{ fontSize: 14, padding: '4px 12px' }}>
              {t('order-status')}: {t(`status-${order.status}`).toUpperCase()}
            </Tag>
            <Tag color={getPaymentStatusColor(order.paymentStatus)} style={{ fontSize: 14, padding: '4px 12px' }}>
              {t('payment-status')}: {order.paymentStatus.toUpperCase()}
            </Tag>
          </Space>

          <Divider />

          <div style={{ marginBottom: 16 }}>
            <Text strong>{t('branch')}:</Text> {order.branchId.name}
            <br />
            <Text strong>{t('table')}:</Text> {order.tableId.tableNumber} ({order.tableId.zone})
            {order.customerName && (
              <>
                <br />
                <Text strong>{t('customer-name-label')}:</Text> {order.customerName}
              </>
            )}
            {order.customerPhone && (
              <>
                <br />
                <Text strong>{t('customer-phone-label')}:</Text> {order.customerPhone}
              </>
            )}
          </div>

          {isCancelled ? (
            <Result
              status="error"
              title={t('order-cancelled-title')}
              subTitle={t('order-cancelled-message')}
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

        <Card title={t('order-items')} style={{ marginBottom: 16 }}>
          <List
            dataSource={order.items}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={item.name[language]}
                  description={
                    <>
                      <div>
                        ฿{item.price} x {item.quantity} = ฿
                        {(item.price * item.quantity).toFixed(2)}
                      </div>
                      {item.specialInstructions && (
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {t('note')}: {item.specialInstructions}
                        </Text>
                      )}
                    </>
                  }
                />
              </List.Item>
            )}
          />

          <Divider />

          <Space orientation="vertical" style={{ width: '100%' }} size="small">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text>{t('subtotal')}:</Text>
              <Text>฿{order.subtotal.toFixed(2)}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text>{t('tax')} (7%):</Text>
              <Text>฿{order.tax.toFixed(2)}</Text>
            </div>
            <Divider style={{ margin: '8px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text strong style={{ fontSize: 18 }}>
                {t('grand-total')}:
              </Text>
              <Text strong style={{ fontSize: 20, color: '#ff4d4f' }}>
                ฿{order.total.toFixed(2)}
              </Text>
            </div>
          </Space>
        </Card>

        <Card>
          <Title level={5}>{t('contact-info')}</Title>
          <Paragraph>
            <Text strong>{t('address')}:</Text> {order.branchId.address}
            <br />
            <Text strong>{t('phone')}:</Text> {order.branchId.phone}
          </Paragraph>
        </Card>
      </Content>
    </Layout>
  );
}
