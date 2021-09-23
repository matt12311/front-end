import {
  DashboardOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  SafetyOutlined,
  StopOutlined,
  DotChartOutlined,
  LineChartOutlined,
  MessageOutlined,
  CalendarOutlined,
  BulbOutlined,
  FileDoneOutlined,
  PlusCircleOutlined,
  ShoppingCartOutlined,
  NotificationOutlined,
  RocketOutlined,
  TeamOutlined,
  ShoppingOutlined,
  FundOutlined,
  ProfileOutlined,
  SolutionOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { APP_PREFIX_PATH, AUTH_PREFIX_PATH } from "configs/AppConfig";
import Roles from "./roles";

const extraNavTree = [
  {
    key: "extra",
    path: `${APP_PREFIX_PATH}/pages`,
    title: "sidenav.pages",
    icon: PlusCircleOutlined,
    breadcrumb: false,
    permission: [Roles.ADMIN, Roles.ADMIN_VA, Roles.SHOP_OWNER],
    submenu: [
      // {
      //   key: 'extra-pages-profile',
      //   path: `${APP_PREFIX_PATH}/pages/profile`,
      //   title: 'sidenav.pages.profile',
      //   icon: ProfileOutlined,
      //   breadcrumb: false,
      //   permission: [
      //     Roles.GUEST,
      //     Roles.WAREHOUSE,
      //     Roles.ADMIN,
      //     Roles.ADMIN_VA,
      //     Roles.SHOP_VA,
      //     Roles.SHOP_OWNER,
      //   ],
      //   submenu: []
      // },

      // {
      //   key: 'extra-pages-invoice',
      //   path: `${APP_PREFIX_PATH}/pages/invoice`,
      //   title: 'sidenav.pages.invoice',
      //   icon: '',
      //   breadcrumb: false,
      //   submenu: []
      // },
      // {
      //   key: 'extra-pages-pricing',
      //   path: `${APP_PREFIX_PATH}/pages/pricing`,
      //   title: 'sidenav.pages.pricing',
      //   icon: '',
      //   breadcrumb: false,
      //   submenu: []
      // },
      // {
      //   key: 'extra-errors',
      //   path: `${AUTH_PREFIX_PATH}/error-2`,
      //   title: 'sidenav.errors',
      //   icon: CreditCardOutlined,
      //   breadcrumb: false,
      //   permission: [
      //     Roles.GUEST,
      //   ],
      //   submenu: []
      // },
      // {
      //   key: 'extra-auth',
      //   path: `${AUTH_PREFIX_PATH}`,
      //   title: 'sidenav.authentication',
      //   icon: SafetyOutlined,
      //   breadcrumb: false,

      //   submenu: [
      //     {
      //       key: 'extra-auth-login-1',
      //       path: `${AUTH_PREFIX_PATH}/login-1`,
      //       title: 'sidenav.authentication.login.1',
      //       icon: '',
      //       breadcrumb: false,
      //       submenu: []
      //     },
      //     {
      //       key: 'extra-auth-login-2',
      //       path: `${AUTH_PREFIX_PATH}/login-2`,
      //       title: 'sidenav.authentication.login.2',
      //       icon: '',
      //       breadcrumb: false,
      //       submenu: []
      //     },
      //     {
      //       key: 'extra-auth-register-1',
      //       path: `${AUTH_PREFIX_PATH}/register-1`,
      //       title: 'sidenav.authentication.register.1',
      //       icon: '',
      //       breadcrumb: false,
      //       submenu: []
      //     },
      //     {
      //       key: 'extra-auth-register-2',
      //       path: `${AUTH_PREFIX_PATH}/register-2`,
      //       title: 'sidenav.authentication.register.2',
      //       icon: '',
      //       breadcrumb: false,
      //       submenu: []
      //     },
      //     {
      //       key: 'extra-auth-forgot-password',
      //       path: `${AUTH_PREFIX_PATH}/forgot-password`,
      //       title: 'sidenav.authentication.forgetPassword',
      //       icon: '',
      //       breadcrumb: false,
      //       submenu: []
      //     }
      //   ]
      // },
      // {
      //   key: 'extra-pages-faq',
      //   path: `${APP_PREFIX_PATH}/pages/faq`,
      //   title: 'sidenav.pages.faq',
      //   icon: '',
      //   breadcrumb: false,
      //   permission: [
      //     "FAQ",
      //     Roles.GUEST,
      //   ],
      //   submenu: []

      // }
      {
        key: "extra-pages-setting",
        path: `${APP_PREFIX_PATH}/pages/setting`,
        title: "sidenav.pages.setting",
        icon: SettingOutlined,
        breadcrumb: true,
        submenu: [],
        permission: [Roles.ADMIN, Roles.ADMIN_VA, Roles.SHOP_OWNER],
      },
    ],
  },
];

const dashBoardNavTree = [
  {
    key: "dashboards",
    path: `${APP_PREFIX_PATH}/dashboards`,
    title: "sidenav.dashboard",
    icon: DashboardOutlined,
    breadcrumb: true,
    permission: [
      Roles.ADMIN,
      Roles.ADMIN_VA,
      Roles.SHOP_VA,
      Roles.GUEST,
      Roles.SHOP_OWNER,
      Roles.WAREHOUSE,
    ],
    submenu: [
      // {
      //   key: 'dashboards-fulfilling-stats',
      //   path: `${APP_PREFIX_PATH}/dashboards/stats`,
      //   title: 'sidenav.dashboard.fulfilling.stats',
      //   icon: DashboardOutlined,
      //   breadcrumb: false,
      //   submenu: [],
      //   permission: [
      //     Roles.ADMIN,
      //     Roles.ADMIN_VA,
      //     Roles.SHOP_VA,
      //     Roles.GUEST,
      //     Roles.SHOP_OWNER,
      //     Roles.WAREHOUSE
      //   ],
      // },
      {
        key: "dashboards-shopify",
        path: `${APP_PREFIX_PATH}/dashboards/shopify`,
        title: "sidenav.dashboard.shopify",
        icon: DotChartOutlined,
        breadcrumb: false,
        permission: [Roles.ADMIN, Roles.SHOP_OWNER, Roles.WAREHOUSE],
        submenu: [],
      },
      {
        key: "dashboards-sales",
        path: `${APP_PREFIX_PATH}/dashboards/sales`,
        title: "sidenav.dashboard.performance",
        icon: FundOutlined,
        breadcrumb: false,
        permission: [
          Roles.ADMIN,
          Roles.SHOP_OWNER,
          Roles.WAREHOUSE,
          Roles.SHOP_VA,
        ],
        submenu: [],
      },
    ],
  },
];

// const admimToolsNavTree = [
//   {
//     key: "adminTools",
//     path: `${APP_PREFIX_PATH}/admin`,
//     title: "sidenav.adminTools",
//     icon: DashboardOutlined,
//     breadcrumb: false,
//     permission: [
//       Roles.ADMIN,
//       Roles.ADMIN_VA,
//       Roles.SHOP_OWNER,
//       Roles.WAREHOUSE,
//       Roles.SHOP_VA,
//     ],
//     submenu: [
//       {
//         key: "adminTools-user",
//         path: `${APP_PREFIX_PATH}/admin/user-list`,
//         title: "sidenav.dashboard.shopify",
//         icon: DotChartOutlined,
//         breadcrumb: false,
//         permission: [Roles.ADMIN, Roles.SHOP_OWNER, Roles.WAREHOUSE],
//         submenu: [],
//       },
//       {
//         key: "adminTools-notificationList",
//         path: `${APP_PREFIX_PATH}/admin/notificationList`,
//         title: "sidenav.adminTools.notificationList",
//         icon: NotificationOutlined,
//         breadcrumb: false,
//         permission: [Roles.ADMIN, Roles.ADMIN_VA],
//         submenu: [],
//       },
//       {
//         // key: 'adminTools-user',
//         // path: `${APP_PREFIX_PATH}/admin-tools/user`,
//         // title: 'sidenav.adminTools.user',
//         // icon: TeamOutlined,
//         // breadcrumb: false,
//         // submenu: [
//         //   {
//         key: "adminTools-userList",
//         path: `${APP_PREFIX_PATH}/admin/userList`,
//         title: "sidenav.adminTools.userList",
//         icon: TeamOutlined,
//         breadcrumb: false,
//         permission: [
//           Roles.ADMIN,
//           Roles.ADMIN_VA,
//           Roles.SHOP_OWNER,
//           Roles.WAREHOUSE,
//           Roles.SHOP_VA,
//         ],
//         submenu: [],
//         //   }
//         // ]
//       },
//     ],
//   },
// ];

const fulfillmentNavTree = [
  {
    key: "fulfillment",
    path: `${APP_PREFIX_PATH}/fulfillment`,
    title: "sidenav.fulfillment",
    icon: DashboardOutlined,
    breadcrumb: false,
    permission: [
      Roles.ADMIN,
      Roles.ADMIN_VA,
      Roles.SHOP_VA,
      Roles.SHOP_OWNER,
      Roles.WAREHOUSE,
    ],
    submenu: [
      {
        key: "fulfillment-shopifyOrders",
        path: `${APP_PREFIX_PATH}/fulfillment/shopify-orders-list`,
        title: "sidenav.fulfillment.shopifyOrders",
        icon: ShoppingOutlined,
        breadcrumb: false,
        submenu: [],
        permission: [
          Roles.ADMIN,
          Roles.ADMIN_VA,
          Roles.SHOP_VA,
          Roles.GUEST,
          Roles.SHOP_OWNER,
          Roles.WAREHOUSE,
        ],
      },
      {
        key: "fulfillment-requests",
        path: `${APP_PREFIX_PATH}/fulfillment/fullfilment-requests-list`,
        title: "sidenav.fulfillment.requests",
        icon: ShoppingCartOutlined,
        breadcrumb: false,
        submenu: [],
        permission: [
          Roles.ADMIN,
          Roles.ADMIN_VA,
          Roles.SHOP_VA,
          Roles.GUEST,
          Roles.SHOP_OWNER,
          Roles.WAREHOUSE,
        ],
      },
      // {
      //   key: 'fulfillment-draftOrdersList',
      //   path: `${APP_PREFIX_PATH}/fulfillment/draft-orders-list`,
      //   title: 'sidenav.fulfillment.draftOrdersList',
      //   icon: CopyOutlined,
      //   breadcrumb: false,
      //   submenu: [

      //   ]
      // },
      // {
      //   key: 'fulfillment-shopifyOrdersInvoiceList',
      //   path: `${APP_PREFIX_PATH}/fulfillment/shopify-orders-invoice-list`,
      //   title: 'sidenav.fulfillment.shopifyOrdersInvoiceList',
      //   icon: FileDoneOutlined,
      //   breadcrumb: false,
      //   submenu: [

      //   ],
      //   permission: [
      //     Roles.ADMIN,
      //     Roles.SHOP_OWNER,
      //   ],
      // }

      {
        key: "user-List",
        path: `${APP_PREFIX_PATH}/fulfillment/user/user-list`,
        title: "User List",
        icon: ShoppingCartOutlined,
        breadcrumb: false,
        submenu: [],
        permission: [
          Roles.ADMIN,
          Roles.ADMIN_VA,
          Roles.SHOP_VA,
          Roles.GUEST,
          Roles.SHOP_OWNER,
          Roles.WAREHOUSE,
        ],
      },
    ],
  },
];

const appsNavTree = [
  {
    key: "apps",
    path: `${APP_PREFIX_PATH}/apps`,
    title: "sidenav.apps",
    icon: AppstoreOutlined,
    breadcrumb: false,
    permission: [
      Roles.ADMIN,
      Roles.ADMIN_VA,
      Roles.SHOP_VA,
      Roles.SHOP_OWNER,
      Roles.GUEST,
      Roles.WAREHOUSE,
    ],
    submenu: [
      // {
      //   key: 'apps-mail',
      //   path: `${APP_PREFIX_PATH}/apps/mail/inbox`,
      //   title: 'sidenav.apps.mail',
      //   icon: MailOutlined,
      //   breadcrumb: false,
      //   submenu: []
      // },
      {
        key: "apps-chat",
        path: `${APP_PREFIX_PATH}/apps/chat`,
        title: "sidenav.apps.chat",
        icon: MessageOutlined,
        breadcrumb: false,
        submenu: [
          {
            key: "apps-chat-admin",
            path: `${APP_PREFIX_PATH}/apps/chat/admin`,
            title: "sidenav.apps.chat.admin",
            icon: "",
            breadcrumb: false,
            permission: [
              Roles.ADMIN,
              Roles.ADMIN_VA,
              Roles.SHOP_VA,
              Roles.SHOP_OWNER,
            ],
            submenu: [],
          },
          {
            key: "apps-chat-view",
            path: `${APP_PREFIX_PATH}/apps/chat/view`,
            title: "sidenav.apps.chat.view",
            icon: "",
            breadcrumb: false,
            permission: [
              Roles.ADMIN,
              Roles.ADMIN_VA,
              Roles.SHOP_VA,
              Roles.SHOP_OWNER,
            ],
            submenu: [],
          },
        ],
        permission: [
          Roles.ADMIN,
          Roles.ADMIN_VA,
          Roles.SHOP_VA,
          Roles.SHOP_OWNER,
          Roles.GUEST,
          Roles.WAREHOUSE,
        ],
      },
      {
        key: "apps-calendar",
        path: `${APP_PREFIX_PATH}/apps/calendar`,
        title: "sidenav.apps.calendar",
        icon: CalendarOutlined,
        breadcrumb: false,
        submenu: [],
        permission: [
          Roles.ADMIN,
          Roles.ADMIN_VA,
          Roles.SHOP_VA,
          Roles.SHOP_OWNER,
          Roles.WAREHOUSE,
        ],
      },
      {
        key: "apps-tracking",
        path: `${APP_PREFIX_PATH}/apps/tracking`,
        title: "sidenav.apps.tracking",
        icon: RocketOutlined,
        breadcrumb: false,
        submenu: [],
        permission: [
          Roles.ADMIN,
          Roles.ADMIN_VA,
          Roles.SHOP_VA,
          Roles.SHOP_OWNER,
          Roles.WAREHOUSE,
        ],
      },
      {
        key: "apps-project",
        path: `${APP_PREFIX_PATH}/apps/project`,
        title: "sidenav.apps.tasks",
        icon: BulbOutlined,
        breadcrumb: false,
        permission: [
          Roles.ADMIN,
          Roles.ADMIN_VA,
          Roles.SHOP_VA,
          Roles.SHOP_OWNER,
          Roles.WAREHOUSE,
        ],
        submenu: [
          {
            key: "apps-project-scrumboard",
            path: `${APP_PREFIX_PATH}/apps/project/scrumboard`,
            title: "sidenav.apps.project.scrumboard",
            icon: "",
            breadcrumb: false,
            permission: [
              Roles.ADMIN,
              Roles.ADMIN_VA,
              Roles.SHOP_VA,
              Roles.SHOP_OWNER,
            ],
            submenu: [],
          },
          {
            key: "apps-project-scrumboard-external",
            path: `${APP_PREFIX_PATH}/apps/project/scrumboardExternal`,
            title: "sidenav.apps.project.scrumboardExternal",
            icon: "",
            breadcrumb: false,
            permission: [
              Roles.ADMIN,
              Roles.ADMIN_VA,
              Roles.SHOP_VA,
              Roles.SHOP_OWNER,
              Roles.WAREHOUSE,
            ],
            submenu: [],
          },
        ],
      },
      {
        key: "apps-ecommerce",
        path: `${APP_PREFIX_PATH}/apps/ecommerce`,
        title: "sidenav.apps.ecommerce",
        icon: ShoppingCartOutlined,
        breadcrumb: false,
        permission: [
          Roles.ADMIN,
          Roles.ADMIN_VA,
          Roles.SHOP_VA,
          Roles.SHOP_OWNER,
          Roles.WAREHOUSE,
        ],
        submenu: [
          {
            key: "apps-ecommerce-productList",
            path: `${APP_PREFIX_PATH}/apps/ecommerce/product-list`,
            title: "sidenav.apps.ecommerce.productList",
            icon: "",
            breadcrumb: false,
            submenu: [],
            permission: [
              Roles.ADMIN,
              Roles.ADMIN_VA,
              Roles.SHOP_VA,
              Roles.SHOP_OWNER,
              Roles.WAREHOUSE,
            ],
          },
          {
            key: "apps-ecommerce-requestProduct",
            path: `${APP_PREFIX_PATH}/apps/ecommerce/request-product`,
            title: "sidenav.apps.ecommerce.requestProduct",
            icon: "",
            breadcrumb: false,
            submenu: [],
            permission: [
              Roles.ADMIN,
              Roles.ADMIN_VA,
              Roles.SHOP_VA,
              Roles.SHOP_OWNER,
            ],
          },
          {
            key: "apps-ecommerce-requestProductList",
            path: `${APP_PREFIX_PATH}/apps/ecommerce/request-product-list`,
            title: "sidenav.apps.ecommerce.requestProductList",
            icon: "",
            breadcrumb: false,
            submenu: [],
            permission: [
              Roles.ADMIN,
              Roles.SHOP_OWNER,
              Roles.SHOP_VA,
              Roles.WAREHOUSE,
            ],
          },

          // {
          //   key: 'apps-ecommerce-editProduct',
          //   path: `${APP_PREFIX_PATH}/apps/ecommerce/edit-product/12`,
          //   title: 'sidenav.apps.ecommerce.editProduct',
          //   icon: '',
          //   breadcrumb: false,
          //   submenu: []
          // },
          // {
          //   key: 'apps-ecommerce-orders',
          //   path: `${APP_PREFIX_PATH}/apps/ecommerce/orders`,
          //   title: 'sidenav.apps.ecommerce.orders',
          //   icon: '',
          //   breadcrumb: false,
          //   submenu: []
          // }
        ],
      },
      {
        key: "apps-payment",
        path: `${APP_PREFIX_PATH}/apps/payment`,
        title: "sidenav.apps.payment",
        icon: SolutionOutlined,
        breadcrumb: true,
        permission: [Roles.ADMIN, Roles.ADMIN_VA, Roles.SHOP_OWNER],
        submenu: [
          {
            key: "apps-payment-productList",
            path: `${APP_PREFIX_PATH}/apps/payment/sales`,
            title: "sidenav.apps.payment.sales",
            icon: "",
            submenu: [],
            permission: [Roles.ADMIN, Roles.SHOP_OWNER],
          },
          {
            key: "apps-payment-orders",
            path: `${APP_PREFIX_PATH}/apps/payment/refunds`,
            title: "sidenav.apps.payment.refunds",
            icon: "",
            breadcrumb: false,
            submenu: [],
            permission: [Roles.ADMIN, Roles.SHOP_OWNER],
          },
          {
            key: "apps-payment-charge",
            path: `${APP_PREFIX_PATH}/apps/payment/charge`,
            title: "sidenav.apps.payment.charge",
            icon: "",
            breadcrumb: false,
            submenu: [],
            permission: [Roles.ADMIN],
          },
        ],
      },
    ],
  },
];
// const docsNavTree = [{
//   key: 'docs',
//   path: `${APP_PREFIX_PATH}/docs`,
//   title: 'sidenav.docs',
//   icon: BookOutlined,
//   breadcrumb: false,
//   submenu: [
//     // {
//     //   key: 'docs-documentation',
//     //   path: `${APP_PREFIX_PATH}/docs/documentation`,
//     //   title: 'sidenav.docs.documentation',
//     //   icon: FileUnknownOutlined,
//     //   breadcrumb: false,
//     //   submenu: []
//     // },
//     // {
//     //   key: 'docs-changelog',
//     //   path: `${APP_PREFIX_PATH}/docs/documentation/changelog`,
//     //   title: 'sidenav.docs.changelog',
//     //   icon: ProfileOutlined,
//     //   breadcrumb: false,
//     //   submenu: []
//     // }
//   ]
// }]

const navigationConfig = [
  ...dashBoardNavTree,
  // ...admimToolsNavTree,
  ...fulfillmentNavTree,
  ...appsNavTree,
  ...extraNavTree,
];

export default navigationConfig;
