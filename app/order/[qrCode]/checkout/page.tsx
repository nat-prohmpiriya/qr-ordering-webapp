'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Layout,
  Card,
  Typography,
  List,
  Button,
  Form,
  Input,
  Divider,
  Space,
  message,
  Result,
} from 'antd';
import { CheckCircleOutlined, ArrowLeftOutlined, GlobalOutlined } from '@ant-design/icons';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';

const { Content } = Layout;
const { Title, Text } = Typography;

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const { language, setLanguage, t } = useLanguage();
  const [form] = Form.useForm();

  const [qrCode, setQrCode] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string>('');
  const [orderNumber, setOrderNumber] = useState<string>('');

  useEffect(() => {
    const fetchParams = async () => {
      const resolvedParams = await params;
      setQrCode(resolvedParams.qrCode as string);
    };
    fetchParams();
  }, [params]);

  useEffect(() => {
    if (items.length === 0 && !orderSuccess) {
      message.warning(t('cart-empty-message'));
      router.push(`/order/${qrCode}`);
    }
  }, [items, qrCode, orderSuccess, router, t]);

  const subtotal = total;
  const tax = subtotal * 0.07;
  const grandTotal = subtotal + tax;

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);

      const orderData = {
        qrCode,
        items: items.map((item) => ({
          menuItemId: item._id,
          quantity: item.quantity,
          price: item.price,
          specialInstructions: item.specialInstructions || undefined,
        })),
        customerName: values.customerName || undefined,
        customerPhone: values.customerPhone || undefined,
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (data.success) {
        setOrderId(data.data._id);
        setOrderNumber(data.data.orderNumber);
        setOrderSuccess(true);
        clearCart();
        message.success(t('order-submit-success'));
      } else {
        message.error(data.error || t('order-submit-error'));
      }
    } catch (error) {
      message.error(t('order-error'));
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
        <Content style={{ padding: '24px', maxWidth: 600, margin: '0 auto' }}>
          <Result
            status="success"
            title={t('order-success')}
            subTitle={`${t('order-number')}: ${orderNumber}`}
            extra={[
              <Button
                type="primary"
                size="large"
                key="track"
                onClick={() => router.push(`/order/track/${orderId}`)}
              >
                {t('track-order')}
              </Button>,
              <Button
                size="large"
                key="menu"
                onClick={() => router.push(`/order/${qrCode}`)}
              >
                {t('back-to-menu')}
              </Button>,
            ]}
          >
            <div style={{ textAlign: 'center' }}>
              <Text type="secondary">
                {t('order-wait-message')}
              </Text>
            </div>
          </Result>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Content style={{ padding: '16px', maxWidth: 600, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => router.back()}
          >
            {t('back')}
          </Button>
          <Button
            type="text"
            icon={<GlobalOutlined />}
            onClick={() => setLanguage(language === 'th' ? 'en' : 'th')}
          >
            {language === 'th' ? 'EN' : 'TH'}
          </Button>
        </div>

        <Card style={{ marginBottom: 16 }}>
          <Title level={3}>{t('confirm-order')}</Title>

          <List
            dataSource={items}
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
              <Text>฿{subtotal.toFixed(2)}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text>{t('tax')} (7%):</Text>
              <Text>฿{tax.toFixed(2)}</Text>
            </div>
            <Divider style={{ margin: '8px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text strong style={{ fontSize: 18 }}>
                {t('grand-total')}:
              </Text>
              <Text strong style={{ fontSize: 20, color: '#ff4d4f' }}>
                ฿{grandTotal.toFixed(2)}
              </Text>
            </div>
          </Space>
        </Card>

        <Card>
          <Title level={4}>{t('customer-info')} ({t('optional')})</Title>
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              name="customerName"
              label={t('customer-name')}
              rules={[
                { max: 100, message: t('customer-name-max-error') },
              ]}
            >
              <Input placeholder={t('customer-name-placeholder')} />
            </Form.Item>

            <Form.Item
              name="customerPhone"
              label={t('customer-phone')}
              rules={[
                {
                  pattern: /^[0-9]{10}$/,
                  message: t('customer-phone-error'),
                },
              ]}
            >
              <Input placeholder={t('customer-phone-placeholder')} maxLength={10} />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={loading}
                icon={<CheckCircleOutlined />}
              >
                {t('confirm-submit')}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
}
