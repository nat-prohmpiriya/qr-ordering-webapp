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
import { CheckCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useCart } from '@/contexts/CartContext';

const { Content } = Layout;
const { Title, Text } = Typography;

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const { items, total, clearCart } = useCart();
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
      message.warning('ตะกร้าสินค้าว่างเปล่า');
      router.push(`/order/${qrCode}`);
    }
  }, [items, qrCode, orderSuccess, router]);

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
        message.success('สั่งอาหารสำเร็จ!');
      } else {
        message.error(data.error || 'ไม่สามารถสั่งอาหารได้');
      }
    } catch (error) {
      message.error('เกิดข้อผิดพลาดในการสั่งอาหาร');
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
            title="สั่งอาหารสำเร็จ!"
            subTitle={`หมายเลขคำสั่งซื้อ: ${orderNumber}`}
            extra={[
              <Button
                type="primary"
                size="large"
                key="track"
                onClick={() => router.push(`/order/track/${orderId}`)}
              >
                ติดตามสถานะออเดอร์
              </Button>,
              <Button
                size="large"
                key="menu"
                onClick={() => router.push(`/order/${qrCode}`)}
              >
                กลับไปที่เมนู
              </Button>,
            ]}
          >
            <div style={{ textAlign: 'center' }}>
              <Text type="secondary">
                กรุณารอสักครู่ พนักงานจะนำอาหารมาเสิร์ฟให้ท่าน
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
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => router.back()}
          style={{ marginBottom: 16 }}
        >
          กลับ
        </Button>

        <Card style={{ marginBottom: 16 }}>
          <Title level={3}>ยืนยันคำสั่งซื้อ</Title>

          <List
            dataSource={items}
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
              <Text>฿{subtotal.toFixed(2)}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text>ภาษี (7%):</Text>
              <Text>฿{tax.toFixed(2)}</Text>
            </div>
            <Divider style={{ margin: '8px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text strong style={{ fontSize: 18 }}>
                ยอดรวมสุทธิ:
              </Text>
              <Text strong style={{ fontSize: 20, color: '#ff4d4f' }}>
                ฿{grandTotal.toFixed(2)}
              </Text>
            </div>
          </Space>
        </Card>

        <Card>
          <Title level={4}>ข้อมูลลูกค้า (ไม่บังคับ)</Title>
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              name="customerName"
              label="ชื่อ"
              rules={[
                { max: 100, message: 'ชื่อต้องไม่เกิน 100 ตัวอักษร' },
              ]}
            >
              <Input placeholder="กรอกชื่อของคุณ (ไม่บังคับ)" />
            </Form.Item>

            <Form.Item
              name="customerPhone"
              label="เบอร์โทรศัพท์"
              rules={[
                {
                  pattern: /^[0-9]{10}$/,
                  message: 'กรุณากรอกเบอร์โทรศัพท์ 10 หลัก',
                },
              ]}
            >
              <Input placeholder="กรอกเบอร์โทรศัพท์ (ไม่บังคับ)" maxLength={10} />
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
                ยืนยันและสั่งอาหาร
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
}
