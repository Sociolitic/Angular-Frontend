import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    title: true,
    name: 'Navigation'
  },
  {
    name: 'Dashboard',
    url: '/default/dashboard',
    icon: 'icon-paper-plane',
  },
  {
    name: 'Analysis',
    url: '/default/reports',
    icon: 'icon-chart',
    badge: {
      variant: 'info',
      text: 'NEW'
    }
  },
  {
    name: 'Settings',
    url: '/default/settings',
    icon: 'icon-settings',
  },
  {
    name: 'Home',
    url: '/home',
    icon: 'icon-home',
  },
  {
    title: true,
    name: 'Theme'
  },
  {
    name: 'Colors',
    url: '/default/theme/colors',
    icon: 'icon-drop'
  },
  {
    name: 'Typography',
    url: '/default/theme/typography',
    icon: 'icon-pencil'
  },
  {
    title: true,
    name: 'Components'
  },
  {
    name: 'Base',
    url: '/default/base',
    icon: 'icon-puzzle',
    children: [
      {
        name: 'Cards',
        url: '/default/base/cards',
        icon: 'icon-puzzle'
      },
      {
        name: 'Carousels',
        url: '/default/base/carousels',
        icon: 'icon-puzzle'
      },
      {
        name: 'Collapses',
        url: '/default/base/collapses',
        icon: 'icon-puzzle'
      },
      {
        name: 'Forms',
        url: '/default/base/forms',
        icon: 'icon-puzzle'
      },
      {
        name: 'Navbars',
        url: '/default/base/navbars',
        icon: 'icon-puzzle'

      },
      {
        name: 'Pagination',
        url: '/default/base/paginations',
        icon: 'icon-puzzle'
      },
      {
        name: 'Popovers',
        url: '/default/base/popovers',
        icon: 'icon-puzzle'
      },
      {
        name: 'Progress',
        url: '/default/base/progress',
        icon: 'icon-puzzle'
      },
      {
        name: 'Switches',
        url: '/default/base/switches',
        icon: 'icon-puzzle'
      },
      {
        name: 'Tables',
        url: '/default/base/tables',
        icon: 'icon-puzzle'
      },
      {
        name: 'Tabs',
        url: '/default/base/tabs',
        icon: 'icon-puzzle'
      },
      {
        name: 'Tooltips',
        url: '/default/base/tooltips',
        icon: 'icon-puzzle'
      }
    ]
  },
  {
    name: 'Buttons',
    url: '/default/buttons',
    icon: 'icon-cursor',
    children: [
      {
        name: 'Buttons',
        url: '/default/buttons/buttons',
        icon: 'icon-cursor'
      },
      {
        name: 'Dropdowns',
        url: '/default/buttons/dropdowns',
        icon: 'icon-cursor'
      },
      {
        name: 'Brand Buttons',
        url: '/default/buttons/brand-buttons',
        icon: 'icon-cursor'
      }
    ]
  },
  {
    name: 'Charts',
    url: '/default/charts',
    icon: 'icon-pie-chart'
  },
  {
    name: 'Icons',
    url: '/default/icons',
    icon: 'icon-star',
    children: [
      {
        name: 'CoreUI Icons',
        url: '/default/icons/coreui-icons',
        icon: 'icon-star',
        badge: {
          variant: 'success',
          text: 'NEW'
        }
      },
      {
        name: 'Flags',
        url: '/default/icons/flags',
        icon: 'icon-star'
      },
      {
        name: 'Font Awesome',
        url: '/default/icons/font-awesome',
        icon: 'icon-star',
        badge: {
          variant: 'secondary',
          text: '4.7'
        }
      },
      {
        name: 'Simple Line Icons',
        url: '/default/icons/simple-line-icons',
        icon: 'icon-star'
      }
    ]
  },
  {
    name: 'Notifications',
    url: '/default/notifications',
    icon: 'icon-bell',
    children: [
      {
        name: 'Alerts',
        url: '/default/notifications/alerts',
        icon: 'icon-bell'
      },
      {
        name: 'Badges',
        url: '/default/notifications/badges',
        icon: 'icon-bell'
      },
      {
        name: 'Modals',
        url: '/default/notifications/modals',
        icon: 'icon-bell'
      }
    ]
  },
  {
    name: 'Widgets',
    url: '/default/widgets',
    icon: 'icon-calculator',
    badge: {
      variant: 'info',
      text: 'NEW'
    }
  },
  {
    divider: true
  },
  {
    title: true,
    name: 'Extras',
  },
  {
    name: 'Pages',
    url: '/default/pages',
    icon: 'icon-star',
    children: [
      {
        name: 'Login',
        url: '/default/login',
        icon: 'icon-star'
      },
      {
        name: 'Register',
        url: '/default/register',
        icon: 'icon-star'
      },
      {
        name: 'Error 404',
        url: '/default/404',
        icon: 'icon-star'
      },
      {
        name: 'Error 500',
        url: '/default/500',
        icon: 'icon-star'
      }
    ]
  },
];
