// 获取当前登录人window.Operator
window.Operator = "gw_wangzm26";
// 获取当前登录人工位
window.getCurrentUserWorkStation = function (callback) {
  let data = {
    code: "0",
    workStation: "W001-1",
    workStationId: "W001",
  };
  callback(data);
};

// 同步当前选中工位到服务器（可被后端覆盖）
window.setCurrentUserWorkStation = function (workStationId, callback) {
  console.log("setCurrentUserWorkStation workStationId:", workStationId);
  // 模拟接口响应
  callback({ code: "0", msg: "同步成功" });
};

// 获取工厂列表
window.getFactory = function (callback) {
  let data = {
    code: "0",
    factories: [
      { id: "F001", name: "工厂A" },
      { id: "F002", name: "工厂B" },
      { id: "F003", name: "工厂C" },
    ],
  };
  callback(data);
};
// 获取产线列表
window.getProductionLine = function (factoryId, callback) {
  let data = {
    code: "0",
    productionLines: [
      {
        id: "L001",
        name: "装配线aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        factoryId: "F001",
      },
      { id: "L002", name: "装配线B", factoryId: "F001" },
      { id: "L003", name: "焊接线A", factoryId: "F002" },
      { id: "L004", name: "焊接线B", factoryId: "F002" },
      { id: "L005", name: "涂装线A", factoryId: "F003" },
    ].filter((line) => line.factoryId === factoryId),
  };
  callback(data);
};
// 获取工位列表
window.getWorkStation = function (productionLineId, callback) {
  let data = {
    code: "0",
    workStations: [
      { id: "W001", name: "工位1", productionLineId: "L001" },
      { id: "W002", name: "工位2", productionLineId: "L001" },
      { id: "W003", name: "工位3", productionLineId: "L001" },
      { id: "W004", name: "工位1", productionLineId: "L002" },
      { id: "W005", name: "工位2", productionLineId: "L002" },
      { id: "W006", name: "工位1", productionLineId: "L003" },
      { id: "W007", name: "工位2", productionLineId: "L003" },
      { id: "W008", name: "工位1", productionLineId: "L004" },
      { id: "W009", name: "工位1", productionLineId: "L005" },
    ].filter((station) => station.productionLineId === productionLineId),
  };
  callback(data);
};
// 查询工位检验项列表
window.dataItem = function (Level, callback) {
  console.log(Level, "检验项查询参数");
  let data = {
    code: "0",
    msg: "查询成功",
    orderStatus: 0,
    workStation: "",
    wipOrderNo: "8888888888",
    productNo: "999999999999999",
    monthSequence: "8888-8888",
    vin: "9999999999",
    serialNo: "9999999999-xxx",
    dispositionItem: [
      {
        dispositionId: 101,
        isConfig: 1,
        dispositionDesc:
          "1112121111111111111111111111111121211111111111111111111111",
        dxDesc: "11",
        testAttribute: "",
        testBy: "gw_wangzm26",
        workCenter: "工作中心1",
        isHandle: 0,
        handleReMark: "1",
        handImgs: "1",
        handleBy: "1",
        isClose: 0,
        confirmReMark: "1",
        confirmImgs: "1",
        confirmBy: "1",
        isFit: 1,
      },
    ],
    questionItem: [
      {
        questionId: 201,
        question: "201",
        imgs: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
        testBy: "gw_wangzm26",
        workCenter: "工作中心1",
        isHandle: 0,
        handleReMark: "3",
        handImgs: "",
        handleBy: "3",
        isClose: 0,
        confirmReMark: "3",
        confirmImgs: "3",
        confirmBy: "3",
        respDept: "",
        respTeam: "",
        respEmployee: "",
        problemSource: "",
      },
      {
        questionId: 202,
        question: "202",
        imgs: "",
        testBy: "gw_wangzm26",
        workCenter: "工作中心1",
        isHandle: 0,
        handleReMark: "4",
        handImgs: "4",
        handleBy: "4",
        isClose: 0,
        confirmReMark: "4",
        confirmImgs: "4",
        confirmBy: "4",
        respDept: "",
        respTeam: "",
        respEmployee: "",
        problemSource: "",
        isFit: 1,
      },
    ],
  };
  callback(data);
};
// 保存或提交
window.InspectionOnlineSaveAndSubmit = function (data, callback) {
  // 入参 data
  let obj = { code: "0", message: "保存成功" };
  callback(obj);
};
window.questionAdd = function (data, callback) {
  // 入参 data
  let obj = { questionId: 203, testBy: "gw_wangzm26" };
  callback(obj);
};
window.questionDel = function (data, callback) {
  // 入参 data
  console.log(data, "测试数据");
  callback(data);
};
// 保存图片
window.saveImgFils = function (params, callback) {
  callback({
    code: 0,
    data: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
  });
};
window.pushFeiShu = function (data, callback) {
  callback({ code: "0" });
};
window.InspectionOnlineSingleSave = function (data, callback) {
  // 入参 data
  let obj = { code: "0", message: "保存成功", testBy: "gw_wangzm26" };
  callback(obj);
};
window.getRespDept = function (callback) {
  let obj = [
    { value: "部门1", label: "部门1" },
    { value: "部门2", label: "部门2" },
  ];
  callback(obj);
};
window.getRespTeam = function (callback) {
  let obj = [
    { value: "班组1", label: "班组1", employee: "员工1" },
    { value: "班组2", label: "班组2", employee: "员工2" },
  ];
  callback(obj);
};
window.getRespEmployee = function (callback) {
  let obj = [
    { value: "1", label: "员工1" },
    { value: "2", label: "员工2" },
  ];
  callback(obj);
};
window.getProblemSource = function (callback) {
  let obj = [
    {
      value: "1",
      label: "问题来源1",
    },
    {
      value: "2",
      label: "问题来源2",
    },
  ];
  callback(obj);
};

window.judgeHasEmployee = function (employeeNo, callback) {
  if (employeeNo === "1") {
    callback({ code: "0", hasEmployee: true });
    return;
  }
  let obj = { code: "0", hasEmployee: false };
  callback(obj);
};
