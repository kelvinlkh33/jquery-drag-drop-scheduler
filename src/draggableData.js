const gridData = [
  {
    CaseName: "",
    CaseNumber: "SCC-02-004",
    ServiceOrderNumber: "SO004-2022",
    AssignedTo: "",
    ServiceItems: [
      {
        TimeFrom: "10:15",
        TimeTo: "12:30",
        ServiceType: "Personal CareNew",
        isLeave: false,
      },
      {
        TimeFrom: "13:00",
        TimeTo: "17:30",
        ServiceType: "ShoppingNew",
        isLeave: true,
      },
    ],
  },
  {
    CaseName: "",
    CaseNumber: "SCC-02-005",
    ServiceOrderNumber: "SO005-2022",
    AssignedTo: "",
    ServiceItems: [
      {
        TimeFrom: "11:15",
        TimeTo: "13:30",
        ServiceType: "Personal CareNew",
        isLeave: false,
      },
      {
        TimeFrom: "17:00",
        TimeTo: "18:30",
        ServiceType: "ShoppingNew",
        isLeave: false,
      },
    ],
  },
];
const todayObject = new Date();

const today = [
  todayObject.getFullYear(),
  (todayObject.getMonth() + 1 > 9 ? "0" : "") + (todayObject.getMonth() + 1),
  (todayObject.getDate() > 9 ? "0" : "") + todayObject.getDate(),
].join("/");

function genDateTime(time) {
  return new Date(today + " " + time);
}

var customData = [];
for (const item of gridData) {
  const { CaseName, CaseNumber, ServiceOrderNumber, AssignedTo, ServiceItems } =
    item;
  for (const serviceItem in ServiceItems) {
    customData.push({
      id: -1,
      title: serviceItem.ServiceType,
      start: genDateTime(serviceItem.TimeFrom),
      end: genDateTime(serviceItem.TimeTo),
      isLeave: serviceItem.isLeve,
      caseName: CaseName,
      caseNumber: CaseNumber,
      serviceOrderNumber: ServiceOrderNumber,
      assignedTo: AssignedTo,
    });
  }
}

export const gridDataShow = gridData;
export const draggableData = customData;
