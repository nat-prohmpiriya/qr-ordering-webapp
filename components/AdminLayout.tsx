'use client';

import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Button } from 'antd';
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  TableOutlined,
  UserOutlined,
  ShopOutlined,
  BarChartOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import type { MenuProps } from 'antd';

const { Header, Sider, Content } = Layout;

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  // Menu items based on user role
  const getMenuItems = (): MenuProps['items'] => {
    const isOwner = session?.user?.role === 'owner';

    const items: MenuProps['items'] = [
      {
        key: '/dashboard',
        icon: <DashboardOutlined />,
        label: 'Dashboard',
        onClick: () => router.push('/dashboard'),
      },
      {
        key: '/admin/orders',
        icon: <ShoppingCartOutlined />,
        label: 'Orders',
        onClick: () => router.push('/admin/orders'),
      },
    ];

    // Owner-only menu items
    if (isOwner) {
      items.push(
        {
          key: '/admin/menu',
          icon: <AppstoreOutlined />,
          label: 'Menu Items',
          onClick: () => router.push('/admin/menu'),
        },
        {
          key: '/admin/tables',
          icon: <TableOutlined />,
          label: 'Tables',
          onClick: () => router.push('/admin/tables'),
        },
        {
          key: '/admin/users',
          icon: <UserOutlined />,
          label: 'Users',
          onClick: () => router.push('/admin/users'),
        },
        {
          key: '/admin/branches',
          icon: <ShopOutlined />,
          label: 'Branches',
          onClick: () => router.push('/admin/branches'),
        },
        {
          key: '/admin/reports',
          icon: <BarChartOutlined />,
          label: 'Reports',
          onClick: () => router.push('/admin/reports'),
        }
      );
    }

    return items;
  };

  // User dropdown menu
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: async () => {
        await signOut({ callbackUrl: '/login' });
      },
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="light">
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: '1px solid #f0f0f0',
            fontWeight: 'bold',
            fontSize: collapsed ? 16 : 18,
          }}
        >
          {collapsed ? 'QR' : 'QR Order System'}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[pathname]}
          items={getMenuItems()}
          style={{ borderRight: 0 }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 16 }}
          />
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />
              <span>
                {session?.user?.name}
                <span style={{ color: '#999', marginLeft: 8, fontSize: 12 }}>
                  ({session?.user?.role})
                </span>
              </span>
            </div>
          </Dropdown>
        </Header>
        <Content
          style={{
            margin: '24px',
            padding: 24,
            background: '#fff',
            borderRadius: 8,
            minHeight: 280,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
