'use client';

import { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, Select, Typography, message, Modal } from 'antd';
import { EyeOutlined, ReloadOutlined } from '@ant-design/icons';
import AdminLayout from '@/components/AdminLayout';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;
const { Option } = Select;

interface Order {
  _id: string;
  orderNumber: string;
  branchId: { name: string };
  tableId: { tableNumber: string };
  items: Array<{
    name: { th: string; en: string };
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const url = statusFilter
        ? `/api/admin/orders?status=${statusFilter}`
        : '/api/admin/orders';
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setOrders(data.data.orders || []);
      } else {
        message.error(data.error || 'Failed to fetch orders');
      }
    } catch (error) {
      message.error('Failed to fetch orders');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        message.success('Order status updated successfully');
        fetchOrders();
      } else {
        message.error(data.error || 'Failed to update order status');
      }
    } catch (error) {
      message.error('Failed to update order status');
      console.error('Error:', error);
    }
  };

  const getStatusColor = (status: string) => {
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

  const getPaymentStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'orange',
      paid: 'green',
      failed: 'red',
      refunded: 'purple',
    };
    return colors[status] || 'default';
  };

  const columns: ColumnsType<Order> = [
    {
      title: 'Order #',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      width: 120,
    },
    {
      title: 'Branch',
      dataIndex: ['branchId', 'name'],
      key: 'branch',
      width: 150,
    },
    {
      title: 'Table',
      dataIndex: ['tableId', 'tableNumber'],
      key: 'table',
      width: 100,
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      width: 100,
      render: (total: number) => `฿${total.toFixed(2)}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (status: string, record: Order) => (
        <Select
          value={status}
          style={{ width: '100%' }}
          onChange={(value) => handleStatusChange(record._id, value)}
        >
          <Option value="pending">Pending</Option>
          <Option value="confirmed">Confirmed</Option>
          <Option value="preparing">Preparing</Option>
          <Option value="ready">Ready</Option>
          <Option value="served">Served</Option>
          <Option value="cancelled">Cancelled</Option>
        </Select>
      ),
    },
    {
      title: 'Payment',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      width: 100,
      render: (status: string) => (
        <Tag color={getPaymentStatusColor(status)}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Time',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date: string) => new Date(date).toLocaleString('en-GB'),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record: Order) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedOrder(record);
              setDetailModalVisible(true);
            }}
          >
            View
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Title level={2}>Orders Management</Title>
        <Space>
          <Select
            placeholder="Filter by status"
            style={{ width: 150 }}
            allowClear
            value={statusFilter || undefined}
            onChange={(value) => setStatusFilter(value || '')}
          >
            <Option value="pending">Pending</Option>
            <Option value="confirmed">Confirmed</Option>
            <Option value="preparing">Preparing</Option>
            <Option value="ready">Ready</Option>
            <Option value="served">Served</Option>
            <Option value="cancelled">Cancelled</Option>
          </Select>
          <Button icon={<ReloadOutlined />} onClick={fetchOrders}>
            Refresh
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={orders}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1000 }}
      />

      <Modal
        title={`Order Details - ${selectedOrder?.orderNumber}`}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedOrder && (
          <div>
            <p><strong>Branch:</strong> {selectedOrder.branchId.name}</p>
            <p><strong>Table:</strong> {selectedOrder.tableId.tableNumber}</p>
            <p><strong>Status:</strong> <Tag color={getStatusColor(selectedOrder.status)}>{selectedOrder.status.toUpperCase()}</Tag></p>
            <p><strong>Payment:</strong> <Tag color={getPaymentStatusColor(selectedOrder.paymentStatus)}>{selectedOrder.paymentStatus.toUpperCase()}</Tag></p>
            <p><strong>Time:</strong> {new Date(selectedOrder.createdAt).toLocaleString('en-GB')}</p>

            <Title level={5} style={{ marginTop: 16 }}>Items:</Title>
            <Table
              dataSource={selectedOrder.items}
              columns={[
                {
                  title: 'Item',
                  dataIndex: ['name', 'en'],
                  key: 'name',
                },
                {
                  title: 'Quantity',
                  dataIndex: 'quantity',
                  key: 'quantity',
                },
                {
                  title: 'Price',
                  dataIndex: 'price',
                  key: 'price',
                  render: (price: number) => `฿${price.toFixed(2)}`,
                },
                {
                  title: 'Total',
                  key: 'total',
                  render: (_, record: any) => `฿${(record.price * record.quantity).toFixed(2)}`,
                },
              ]}
              pagination={false}
              size="small"
            />

            <div style={{ marginTop: 16, textAlign: 'right' }}>
              <p><strong>Subtotal:</strong> ฿{selectedOrder.subtotal.toFixed(2)}</p>
              <p><strong>Tax:</strong> ฿{selectedOrder.tax.toFixed(2)}</p>
              <p style={{ fontSize: 18, fontWeight: 'bold' }}>
                <strong>Total:</strong> ฿{selectedOrder.total.toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}
