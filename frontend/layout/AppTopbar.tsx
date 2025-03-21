/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useImperativeHandle, useRef, useState } from 'react';
import { AppTopbarRef } from '@/types';
import { LayoutContext } from './context/layoutcontext';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { Tooltip } from 'primereact/tooltip';
const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
  const { layoutConfig, layoutState, onMenuToggle } = useContext(LayoutContext);
  const menubuttonRef = useRef(null);
  const topbarmenuRef = useRef(null);
  const topbarmenubuttonRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const router = useRouter();

  useImperativeHandle(ref, () => ({
    menubutton: menubuttonRef.current,
    topbarmenu: topbarmenuRef.current,
    topbarmenubutton: topbarmenubuttonRef.current
  }));

  // Xử lý mở menu
  const handleProfileClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Xử lý đóng menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Xử lý xem thông tin
  const handleViewProfile = () => {
    handleClose();
    router.push('/profile');
  };

  // Xử lý đăng xuất
  const handleLogout = () => {
    Cookies.remove('accessToken');
    handleClose();
    router.push('/auth/login');
  };

  return (
    <div className="layout-topbar">
      <Link href="/" className="layout-topbar-logo">
        <img src={`/layout/images/logo-${layoutConfig.colorScheme !== 'light' ? 'white' : 'dark'}.svg`} width="47.22px" height="35px" alt="logo" />
        <span>Quản Lý Sản Xuất </span>
      </Link>

      <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
        <i className="pi pi-bars" />
      </button>

      {/* Nút user để mở menu */}

      <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
        <Tooltip target=".custom-target-icon" />
        <button
          className="p-link layout-menu-button layout-topbar-button"
          type="button"
          ref={topbarmenubuttonRef}
          onClick={handleProfileClick}
          data-pr-tooltip="Xem thông tin"
          data-pr-position="right"
          data-pr-at="right+5 top"
          data-pr-my="left center-2"
        >
          {' '}
          <i className="pi pi-user" />
        </button>
        <button type="button" className="p-link layout-topbar-button" onClick={handleLogout}>
          <i className="pi pi-sign-out"></i>
          <span>Đăng xuất</span>
        </button>
        {/* <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          <MenuItem onClick={handleViewProfile}>Xem thông tin</MenuItem>
          <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
        </Menu> */}
        {/* <Link href="/documentation">
          <button type="button" className="p-link layout-topbar-button">
            <i className="pi pi-cog"></i>
            <span>Settings</span>
          </button>
        </Link> */}
      </div>
    </div>
  );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
