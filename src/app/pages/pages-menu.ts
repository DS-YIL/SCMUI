import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
    {
        title: 'Dashboard',
        icon: 'home-outline',
        link: '/SCM/Dashboard',
        home: true,
    },
    {
        title: 'MPR',
        icon: 'keypad-outline',
        expanded: false,
        children: [
            {
                title: 'MPR Form',
                link: '/SCM/MPRForm',
                icon: 'list-outline'
            },
            {
                title: 'MPR List',
                link: '/SCM/MPRList',
                icon: 'list-outline'
            },
            {
                title: 'MPR Checker List',
                link: '/SCM/MPRCheckerList',
                icon: 'list-outline'
            },
            {
                title: 'MPR Approver List',
                link: '/SCM/MPRApproverList',
                icon: 'list-outline'
            }
            ,
            {
                title: 'Single Vendor Approver List',
                link: '/SCM/MPRSingleVendorList',
                icon: 'list-outline'
            },
            {
                title: 'PA For Approval',
                link: '/SCM/MPRPAApproverList',
                icon: 'layers-outline'
            },
            {
                title: 'PA Approval Tracking',
                link: '/SCM/MPRPAList',
                icon: 'layers-outline'
            },

        ],


    },
    {
        title: 'RFQ',
        icon: 'keypad-outline',
        expanded: false,
        children: [
            {
                title: 'RFQ Form',
                link: '/SCM/RFQForm',
                icon: 'list-outline'
            },
            {
                title: 'RFQ List',
                link: '/SCM/RFQList',
                icon: 'list-outline'
            }
        ],

    },


    {
        title: 'Masters',
        icon: 'people-outline',
        expanded: false,
        children: [
            {
                title: 'Approver',
                link: '/SCM/Approvers',
                icon: 'person-done-outline'
            },
            {
                title: 'Buyer',
                link: '/SCM/Buyers',
                icon: 'shopping-bag-outline'
            },
            {
                title: 'Department',
                link: '/SCM/Departments',
                icon: 'list-outline'
            },
            {
                title: 'Scope',
                link: '/SCM/Scopes',
                icon: 'list-outline'
            },
            {
                title: 'Procurement Source',
                link: '/SCM/ProcurementSource',
                icon: 'list-outline'
            },
            {
                title: 'Project Manager',
                link: '/SCM/ProjectManager',
                icon: 'list-outline'
            },
            {
                title: 'PA Approver Cofiguration',
                link: '/SCM/EmployeeConfiguration',
                icon: 'layers-outline'
            },
            {
                title: 'Terms And Conditions',
                link: '/SCM/TermsAndConditions',
                icon: 'layers-outline'
            },
            {
                title: 'Currency Master',
                link: '/SCM/CurrencyMaster',
                icon: 'layers-outline'
            },
            {
                title: 'PA Slabs',
                link: '/SCM/AddSlab',
                icon: 'layers-outline'
            },
            {
                title: 'PA CreditDays Limit',
                link: '/SCM/CreditDays',
                icon: 'layers-outline'
            },
            {
                title: 'Upload Vendors',
                link: '/SCM/UploadVendor',
                icon: 'upload-outline'
            },
            {
                title: 'Send email to vendors',
                link: '/SCM/VendorEmailTemplate',
                icon: 'email-outline'
            }
        ],


    },
    {
        title: 'Purchase Authorization',
        icon: 'lock-outline',
        expanded: false,
        children: [
            //{
            //  title: 'MPRPA',
            //  link: '/SCM/mprpa',
            //  icon: 'layers-outline'
            //},
            {
                title: 'Generate PA',
                link: '/SCM/PADetails',
                icon: 'layers-outline'
            },
            //{
            //  title: 'Employee Configuration',
            //  link: '/SCM/EmployeeConfiguration',
            //  icon: 'layers-outline'
            //},

            //{
            //    title: 'PA List',
            //    link: '/SCM/MPRPAList',
            //    icon: 'layers-outline'
            //},
            {
                title: 'PA For Approval',
                link: '/SCM/MPRPAApproverList',
                icon: 'layers-outline'
            },
            {
                title: 'PAIncompleted List',
                link: '/SCM/incompletedpa',
                icon: 'layers-outline'
            },
            {
                title: 'PA List',
                link: '/SCM/MPRPAList',
                icon: 'layers-outline'
            },
            {
                title: 'Tokuchu Req List',
                link: '/SCM/TokochuReqList',
                icon: 'layers-outline'
            }
        ],
    },
    {
        title: 'Auth',
        icon: 'lock-outline',
        expanded: false,
        children: [
            {
                title: 'Access Group',
                link: '/SCM/Configuration',
                icon: 'layers-outline'
            },
            {
                title: 'Access Name',
                link: '/SCM/Groupaccessibility',
                icon: 'layers-outline'
            },
            {
                title: 'Authorization Group',
                link: '/SCM/Roleaccessibility',
                icon: 'people-outline'
            },
            {
                title: 'Authorization Item',
                link: '/SCM/Authorizationitem',
                icon: 'layers-outline'
            }

        ],


    },
    {
        title: 'Reports',
        icon: 'lock-outline',
        expanded: false,
        children: [
            {
                title: 'Savings Report',
                link: '/SCM/SavingsReport',
                icon: 'list-outline'
            },
            {
                title: 'MPR Status Track',
                link: '/SCM/pareports',
                icon: 'list-outline'
            },
        ],
    },
    {
        title: 'Vendor Registraion',
        icon: 'lock-outline',
        expanded: false,
        children: [
            {
                title: 'Vendor Reg Initiate',
                link: '/SCM/VendorRegInitiate',
                icon: 'list-outline'
            },
            {
                title: 'Vendor Reg List',
                link: '/SCM/VendorRegList',
                icon: 'list-outline'
            }
            ,
            {
                title: 'Vendor Reg Pending List',
                link: '/SCM/VendorRegPendingList',
                icon: 'list-outline'
            }
        ],
    },
    {
        title: 'MPR Reports',
        icon: 'lock-outline',
        expanded: false,
        children: [
            {
                title: 'MPR Status Report',
                link: '/SCM/statusreport',
                icon: 'list-outline'
            },
            {
                title: 'MPRWise Report',
                link: '/SCM/mprwisereport',
                icon: 'list-outline'
            },
            {
                title: 'Requisition Report',
                link: '/SCM/requisitionreport',
                icon: 'list-outline'
            },
            {
                title: 'Project Report',
                link: '/SCM/projectreport',
                icon: 'list-outline'
            },
            {
                title: 'Project Duration',
                link: '/SCM/projectduration',
                icon: 'list-outline'
            },
            {
                title: 'PA Report',
                link: '/SCM/PAstatusReport',
                icon: 'list-outline'
            },
        ],
    },
    {
        title: 'ASN',
        icon: 'lock-outline',
        expanded: false,
        children: [
            {
                title: 'ASN Initiate',
                link: '/SCM/ASNInitiate',
                icon: 'list-outline'
            },
            {
                title: 'ASN List',
                link: '/SCM/ASNList',
                icon: 'list-outline'
            },
        ],
    },
];
