<template>
  <div class="home">
    <!-- 顶部显示当前登录人工位 -->
    <div class="user-workstation-display" @click="openWorkStationDialog">
      <span class="workstation-label">工位：</span>
      <span class="workstation-value">{{
        currentUserWorkStation || "未设置"
      }}</span>
    </div>

    <div class="collapse-container">
      <!-- 顶部固定区域 - 始终显示 -->
      <div class="fixed-section">
        <div class="fixed-content">
          <div class="toggle-icon" @click="toggleCollapse">
            <i
              :class="isCollapsed ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"
            ></i>
          </div>
          <!-- 右侧：当前订单输入框和折叠按钮 -->
          <div class="right-panel">
            <div class="order-input">
              <el-input
                v-model="searchParam"
                size="small"
                class="order-field"
                placeholder="订单号/月顺序号/VIN/钢印号"
              >
                <el-button
                  style="margin-right: 5px"
                  slot="append"
                  icon="el-icon-search"
                  @click="handleOrderSearch"
                ></el-button>
                <el-button
                  slot="append"
                  icon="el-icon-full-screen"
                  @click="onCamera('wipOrderNo')"
                ></el-button>
              </el-input>
            </div>
          </div>
        </div>
      </div>

      <!-- 可折叠区域 -->
      <transition name="slide">
        <div class="collapsible-section" v-show="!isCollapsed">
          <div class="collapsible-content">
            <!-- 左侧：机型编码 -->
            <div class="left-panel">
              <div class="model-code-section">
                <div class="section-title">机型编码</div>
                <div class="model-code" v-if="modelCode">{{ modelCode }}</div>
                <div class="no-data" v-else>暂无机型编码</div>
              </div>
              <div class="model-code-section">
                <div class="section-title">订单</div>
                <div class="model-code" v-if="currentOrder">
                  {{ currentOrder }}
                </div>
                <div class="no-data" v-else>暂无订单</div>
              </div>
              <!-- 工位选择按钮 -->
              <div class="workstation-select-section" v-if="false">
                <el-button
                  type="primary"
                  size="small"
                  @click="openWorkStationDialog"
                  icon="el-icon-setting"
                >
                  选择工位
                </el-button>
              </div>
            </div>

            <!-- 右侧：输入框区域 -->
            <div class="right-panel">
              <div class="input-section">
                <div class="input-row">
                  <div class="input-label">月顺序号</div>
                  <el-input
                    v-model="monthlySequence"
                    size="small"
                    class="input-field"
                    disabled
                  >
                  </el-input>
                </div>

                <div class="input-row" v-if="false">
                  <div class="input-label">VIN码</div>
                  <el-input
                    v-model="frameNumber"
                    size="small"
                    class="input-field"
                    disabled
                  >
                  </el-input>
                </div>
                <div class="input-row">
                  <div class="input-label">序列号</div>
                  <el-input
                    v-model="serialNo"
                    size="small"
                    class="input-field"
                    disabled
                  >
                  </el-input>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <!-- 新增部分：单据状态和检验结果 -->
    <div class="inspection-container" v-show="currentOrder.trim() !== ''">
      <!-- 单据状态行 -->
      <div class="document-status">
        <div class="status-item">
          <span class="status-label">单据状态：</span>
          <span class="status-value">{{ documentStatus }}</span>
        </div>
        <div class="status-item">
          <span class="status-label">检验结果：</span>
          <span class="status-value">{{ inspectionResult }}</span>
        </div>
      </div>

      <!-- 问题区域 -->
      <div class="problem-section">
        <div class="section-header">
          <span class="section-title">问题</span>
          <el-radio-group v-model="showIsHandle" size="small">
            <el-radio-button label="0">未处置</el-radio-button>
            <el-radio-button label="1">已处置</el-radio-button>
            <el-radio-button label="2">已确认</el-radio-button>
          </el-radio-group>
        </div>
        <div class="problem-list">
          <div
            v-for="(problem, index) in filteredProblemList"
            :key="problem.questionId"
            class="problem-item"
            @click="
              customDisable(problem) === false
                ? handleOpenDialog(problem, index, 'problem')
                : null
            "
          >
            <div class="problem-content">
              <div class="problem-row">
                <span class="problem-label">问题{{ index + 1 }}：</span>
                <el-input
                  v-model="problem.question"
                  class="problem-input"
                  @input="handleProblemInputChange(problem, $event)"
                  :disabled="customDisable(problem)"
                  type="textarea"
                  autosize
                  v-keyboard-focus
                >
                </el-input>
                <el-button
                  type="danger"
                  icon="el-icon-minus"
                  size="small"
                  @click="removeProblem(problem)"
                  class="remove-btn"
                  v-if="!customDisable(problem)"
                >
                </el-button>
                <el-button
                  type="primary"
                  size="small"
                  @click="pushFeiShu(problem, 'problem')"
                  class="push-btn"
                  :disabled="problem.pushStatus === 1"
                >
                  推送
                </el-button>
              </div>
              <div class="problem-row">
                <span class="problem-label">图片：</span>
                <div class="image-upload-section">
                  <div class="image-upload-container">
                    <!-- 图片列表水平滚动 -->
                    <div class="image-scroll-container">
                      <div class="image-list-horizontal">
                        <div
                          v-for="(image, imgIndex) in problem.imageList"
                          :key="imgIndex"
                          class="image-item"
                          @click="handlePictureCardPreview(image)"
                        >
                          <img
                            :src="image.url"
                            :alt="image.name"
                            class="uploaded-image"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="image-count">
                    {{ problem.imageList.length }}/30
                  </div>
                </div>
              </div>
              <div class="problem-row">
                <span class="problem-label">检验人：</span>
                <el-input
                  v-model="problem.testBy"
                  class="problem-input"
                  disabled
                ></el-input>
              </div>
              <div class="problem-row">
                <span class="problem-label">工作中心：</span>
                <el-input
                  v-model="problem.workCenter"
                  class="problem-input"
                  disabled
                ></el-input>
              </div>
              <div class="problem-row">
                <span class="problem-label">责任部门：</span>
                <el-select v-model="problem.respDept" disabled size="small">
                  <el-option
                    v-for="item in respDeptOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <span class="problem-label">责任班组：</span>
                <el-select
                  v-model="problem.respTeam"
                  disabled
                  size="small"
                  @change="onRespTeamChange(problem)"
                >
                  <el-option
                    v-for="item in respTeamOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
              <div class="problem-row">
                <span class="problem-label">责任人：</span>
                <el-input
                  v-model="problem.respEmployee"
                  class="problem-input"
                  :disabled="true"
                  type="textarea"
                  autosize
                >
                </el-input>
                <span class="problem-label">问题来源：</span>
                <el-select
                  v-model="problem.problemSource"
                  filterable
                  disabled
                  size="small"
                >
                  <el-option
                    v-for="item in problemSourceOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>

              <div class="problem-row">
                <span class="problem-label">自动处置：</span>
                <el-radio-group
                  v-model="problem.autoHandle"
                  @change="onAutoHandleChange(problem)"
                  style="padding-top: 8px"
                  size="small"
                  disabled
                >
                  <el-radio :label="0">否</el-radio>
                  <el-radio :label="1">是</el-radio>
                </el-radio-group>

                <span
                  v-if="problem.isFit === 1"
                  class="problem-label"
                  style="margin-left: 50px; color: red"
                  >质量门问题</span
                >
              </div>
            </div>
          </div>
        </div>
        <div class="section-header">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="small"
            @click="addProblem"
            class="add-btn"
            v-if="this.originalData.orderStatus !== 3"
          >
            添加问题
          </el-button>
        </div>
      </div>
    </div>

    <!-- 图片预览对话框 -->
    <el-dialog
      :visible.sync="dialogVisible"
      :append-to-body="true"
      fullscreen
      @close="resetPreviewTransform"
    >
      <div class="image-preview-container" @wheel.prevent="handleWheel">
        <img
          ref="previewImage"
          :src="dialogImageUrl"
          alt=""
          class="preview-image"
          :style="previewImageStyle"
          @load="onImageLoad"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
        />
      </div>
      <div class="image-preview-toolbar">
        <button @click="zoomIn" class="toolbar-btn">+</button>
        <button @click="zoomOut" class="toolbar-btn">-</button>
        <button @click="resetPreviewTransform" class="toolbar-btn">1:1</button>
        <button @click="fitPreviewImage" class="toolbar-btn">适应</button>
      </div>
    </el-dialog>

    <!-- 工位选择对话框 -->
    <el-dialog
      :visible.sync="workStationDialogVisible"
      :append-to-body="true"
      title="选择工位"
      fullscreen
      @open="loadFactories"
    >
      <div class="workstation-select-form">
        <div class="form-row">
          <label class="form-label">工厂：</label>
          <div class="select-field">
            <el-select
              v-model="selectedFactory"
              filterable
              placeholder="请选择工厂"
              @change="onFactoryChange"
              clearable
              popper-class="workstation-select-dropdown"
            >
              <el-option
                v-for="factory in factoryOptions"
                :key="factory.id"
                :label="factory.name"
                :value="factory.id"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="form-row">
          <label class="form-label">产线：</label>
          <div class="select-field">
            <el-select
              append-to-body
              v-model="selectedProductionLine"
              filterable
              placeholder="请选择产线"
              @change="onProductionLineChange"
              :disabled="!selectedFactory"
              clearable
              popper-class="workstation-select-dropdown"
            >
              <el-option
                v-for="line in productionLineOptions"
                :key="line.id"
                :label="line.name"
                :value="line.id"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="form-row">
          <label class="form-label">工位：</label>
          <div class="select-field">
            <el-select
              v-model="selectedWorkStation"
              filterable
              placeholder="请选择工位"
              :disabled="!selectedProductionLine"
              clearable
              popper-class="workstation-select-dropdown"
            >
              <el-option
                v-for="station in workStationOptions"
                :key="station.id"
                :label="station.name"
                :value="station.id"
              >
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="workStationDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmWorkStationSelection"
          >确定</el-button
        >
      </div>
    </el-dialog>

    <!-- 问题项编辑对话框 -->
    <el-dialog
      :visible.sync="dialogProblemVisible"
      :append-to-body="true"
      fullscreen
      :showClose="true"
      style="padding: 0"
    >
      <div class="problem-row">
        <span class="problem-label">问题{{ dialogIndex + 1 }}：</span>
        <el-input
          v-model="dialogProblemData.question"
          class="problem-input"
          @input="handleProblemInputChange(dialogProblemData, $event)"
          :disabled="customDisable(dialogProblemData, '')"
          type="textarea"
          autosize
          v-keyboard-focus
        >
        </el-input>
      </div>
      <div class="problem-row">
        <span class="problem-label">图片：</span>
        <div class="image-upload-section">
          <div class="image-upload-container">
            <!-- 移动端上传按钮 -->
            <div
              v-if="!customDisable(dialogProblemData, '')"
              class="mobile-upload-btn"
              @click="handleMobileUpload(dialogProblemData.questionId)"
            >
              <i class="el-icon-plus"></i>
              <div class="upload-text">添加图片</div>
            </div>

            <!-- 图片列表水平滚动 -->
            <div class="image-scroll-container">
              <div class="image-list-horizontal">
                <div
                  v-for="(image, imgIndex) in dialogProblemData.imageList"
                  :key="imgIndex"
                  class="image-item"
                  @click="handlePictureCardPreview(image)"
                >
                  <img
                    :src="image.url"
                    :alt="image.name"
                    class="uploaded-image"
                  />
                  <div class="image-actions">
                    <i
                      class="el-icon-delete"
                      v-if="!customDisable(dialogProblemData, '')"
                      @click.stop="
                        removeSingleImage(dialogProblemData, imgIndex)
                      "
                    ></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="problem-row">
        <span class="problem-label">检验人：</span>
        <el-input
          v-model="dialogProblemData.testBy"
          class="problem-input"
          disabled
        ></el-input>
      </div>
      <div class="problem-row">
        <span class="problem-label">工作中心：</span>
        <el-input
          v-model="dialogProblemData.workCenter"
          class="problem-input"
          disabled
        ></el-input>
      </div>
      <div class="problem-row">
        <span class="problem-label">责任部门：</span>
        <el-select v-model="dialogProblemData.respDept" size="small" clearable>
          <el-option
            v-for="item in respDeptOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <span class="problem-label">责任班组：</span>
        <el-select
          v-model="dialogProblemData.respTeam"
          size="small"
          clearable
          @change="onRespTeamChange(dialogProblemData)"
        >
          <el-option
            v-for="item in respTeamOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div class="problem-row">
        <span class="problem-label">责任人：</span>
        <el-input
          v-model="dialogProblemData.respEmployee"
          class="problem-input"
          type="textarea"
          autosize
          :disabled="customDisable(dialogProblemData)"
          v-keyboard-focus
        >
        </el-input>
        <span class="problem-label">问题来源：</span>
        <el-select
          v-model="dialogProblemData.problemSource"
          size="small"
          clearable
        >
          <el-option
            v-for="item in problemSourceOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div class="problem-row">
        <span class="problem-label">自动处置：</span>
        <el-radio-group
          v-model="dialogProblemData.autoHandle"
          @change="onAutoHandleChange(dialogProblemData)"
          style="padding-top: 8px"
          size="small"
        >
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </div>
      <div class="fixed-action-buttons">
        <el-button
          type="primary"
          @click="handleCloseDialog('SaveQuestion')"
          class="save-btn"
          >保存并返回
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import keyboardMixin from "@/utils/keyboardMixin";

export default {
  name: "HomeView",
  components: {},
  mixins: [keyboardMixin],
  data() {
    return {
      // 判断是否是手机
      isApp: false,
      isCollapsed: true,
      currentOrder: "",
      monthlySequence: "",
      frameNumber: "",
      serialNo: "",
      modelCode: "",
      Operator: "",
      searchParam: "",

      // 当前登录人工位
      currentUserWorkStation: "",
      currentUserWorkStationId: "",

      // 工位选择相关
      workStationDialogVisible: false,
      selectedFactory: "",
      selectedProductionLine: "",
      selectedWorkStation: "",
      factoryOptions: [],
      productionLineOptions: [],
      workStationOptions: [],

      respDeptOptions: [],
      respTeamOptions: [],
      respEmployeeOptions: [],
      problemSourceOptions: [],

      // 新增数据
      tableMaxHeight: 300,
      inspectionList: [],
      problemList: [],
      nextProblemId: 1,

      // 图片预览对话框
      dialogImageUrl: "",
      dialogVisible: false,
      // 图片预览缩放相关
      previewScale: 1,
      previewTranslateX: 0,
      previewTranslateY: 0,
      startTouchDistance: 0,
      startTouchScale: 1,

      // 新增：存储查询返回的原始数据
      originalData: {
        workStation: "",
        wipOrderNo: "",
        productNo: "",
        monthSequence: "",
        vin: "",
        serialNo: "",
        dispositionItem: [],
        questionItem: [],
      },

      // 单项操作
      dialogTestData: {},
      dialogTestVisible: false,
      dialogProblemData: {},
      dialogProblemVisible: false,
      dialogIndex: -1,
      pushFlag: false,

      // 标签页
      showIsHandle: "0",
    };
  },
  mounted() {
    this.isApp = this.isAppEnvironment();
    // 设置表格最大高度为屏幕的1/3
    this.setTableMaxHeight();
    window.addEventListener("resize", this.setTableMaxHeight);
    this.Operator = window.Operator;
    // 获取当前登录人工位
    window.getCurrentUserWorkStation((res) => {
      if (res.code === "0") {
        this.currentUserWorkStation = res.workStation;
        this.currentUserWorkStationId = res.workStationId;
      }
    });
    window.getRespDept((res) => {
      console.log(res, "getRespDept");
      this.respDeptOptions = res;
    });
    window.getRespTeam((res) => {
      this.respTeamOptions = res;
    });
    // window.getRespEmployee((res) => {
    //   this.respEmployeeOptions = res;
    // });
    window.getProblemSource((res) => {
      this.problemSourceOptions = res;
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.setTableMaxHeight);
  },
  computed: {
    // 计算单据状态
    documentStatus() {
      return this.originalData.orderStatus === 3 ? "已关闭" : "检验中";
    },

    // 计算检验结果
    inspectionResult() {
      return this.problemList.every((item) => item.isClose === 1)
        ? "合格"
        : "不合格";
    },

    // 图片预览样式计算属性
    previewImageStyle() {
      return {
        transform: `scale(${this.previewScale}) translate(${this.previewTranslateX}px, ${this.previewTranslateY}px)`,
        transition: this.isTransitioning ? "transform 0.2s ease" : "none",
      };
    },

    // 过滤后的问题列表
    filteredProblemList() {
      if (this.showIsHandle === "0") {
        // 显示未处置的问题
        return this.problemList.filter((problem) => problem.isHandle !== 1);
      } else if (this.showIsHandle === "1") {
        // 显示已处置未确认的问题
        return this.problemList.filter(
          (problem) => problem.isHandle === 1 && problem.isClose !== 1,
        );
      } else {
        // 显示已处置已确认的问题
        return this.problemList.filter(
          (problem) => problem.isHandle === 1 && problem.isClose === 1,
        );
      }
    },
  },
  methods: {
    async handleCloseDialog(type) {
      this.syncProblemData();
      let saveData = {};
      if (type === "SaveInspection") {
        console.log("保存检验项");
      } else if (type === "SaveQuestion") {
        console.log(this.dialogProblemData, "this.dialogProblemData");
        let aa = { ...this.dialogProblemData };
        const questionId = aa.questionId;
        const question = aa.question;
        const img = aa.imgs;
        const respDept = aa.respDept;
        const respTeam = aa.respTeam;
        const respEmployee = aa.respEmployee;
        const problemSource = aa.problemSource;
        const autoHandle = aa.autoHandle;

        if (img.length === 0) {
          this.$message({
            type: "error",
            message: "最少需要上传一张图片!",
            duration: 1000,
            showClose: true,
          });
          return;
        }
        if (respDept.trim() === "") {
          this.$message({
            type: "error",
            message: "责任部门不能为空!",
            duration: 1000,
            showClose: true,
          });
          return;
        }
        if (autoHandle === 1 && img.split(",").length < 2) {
          if (respTeam.trim() === "") {
            this.$message({
              type: "error",
              message: "自动处置时最少上传两张图片!",
              duration: 1000,
              showClose: true,
            });
            return;
          }
        }
        this.dialogProblemVisible = false;
        saveData = {
          flag: type,
          id: questionId,
          question: question,
          img: img,
          respDept: respDept,
          respTeam: respTeam,
          respEmployee: respEmployee,
          problemSource: problemSource,
          autoHandle: autoHandle,
        };
        console.log(saveData, "saveData");
        window.InspectionOnlineSingleSave(saveData, (res) => {
          this.problemList.find(
            (item) => item.questionId === saveData.id,
          ).testBy = res.testBy;
        });
      }
      console.log(JSON.parse(JSON.stringify(saveData)), "最终保存的数据");
    },
    // 根据选择的班组自动带出责任人
    onRespTeamChange(problemData) {
      if (!problemData.respTeam) {
        problemData.respEmployee = "";
        return;
      }

      // 查找对应的班组数据
      const selectedTeam = this.respTeamOptions.find(
        (team) => team.value === problemData.respTeam,
      );
      if (selectedTeam && selectedTeam.employee) {
        problemData.respEmployee = selectedTeam.employee;
      } else {
        problemData.respEmployee = "";
      }
    },
    handleOpenDialog(item, index, type) {
      if (this.pushFlag) {
        this.pushFlag = false;
        return;
      }
      this.dialogIndex = index;
      if (type === "inspection") {
        this.dialogTestData = item;
        // 避免图片预览被覆盖
        this.dialogTestVisible = this.dialogVisible !== true;
      } else if (type === "problem") {
        this.dialogProblemData = item;
        // 避免图片预览被覆盖
        this.dialogProblemVisible = this.dialogVisible !== true;
      }
    },
    // 推送飞书
    pushFeiShu(data, type) {
      this.pushFlag = true;
      this.$msgbox({
        title: "推送飞书",
        message: "是否推送飞书？再次推送需要退出重进",
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let pushData = {
            ...this.originalData,
          };
          if (type === "inspection") {
            pushData = {
              ...pushData,
              dispositionItem: this.originalData.dispositionItem.filter(
                (item) =>
                  item.dispositionId === data.dispositionId &&
                  item.testAttribute !== "OK" &&
                  item.dxDesc !== "" &&
                  item.dispositionDesc !== "",
              ),
              questionItem: [],
            };
            data.pushStatus = 1;
          } else if (type === "problem") {
            pushData = {
              ...pushData,
              questionItem: this.originalData.questionItem.filter(
                (item) =>
                  item.questionId === data.questionId && item.question !== "",
              ),
              dispositionItem: [],
            };
            data.pushStatus = 1;
          }
          console.log(pushData, "推送飞书");
          window.pushFeiShu(pushData, (res) => {
            if (res.code === "0") {
              this.$message({
                message: "推送飞书成功",
                type: "success",
                duration: 1000,
                showClose: true,
              });
            } else {
              this.$message({
                message: "推送飞书失败",
                type: "error",
                duration: 1000,
                showClose: true,
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消推送",
          });
        });
    },
    customDisable(item) {
      return (
        this.originalData.orderStatus === 3 ||
        (item.testBy !== this.Operator && item.testBy !== "") ||
        item.isHandle === 1
      );
    },
    // 扫码
    onCamera(type) {
      window.parent.OpenCamera &&
        window.parent.OpenCamera((res) => {
          if (res.code == 200) {
            this.searchParam = "";
            this.monthlySequence = "";
            this.frameNumber = "";
            if (type === "wipOrderNo") {
              this.searchParam = res.data;
              this.handleOrderSearch();
            } else if (type === "vin") {
              this.frameNumber = res.data;
              this.handleFrameNumberSearch();
            } else if (type === "monthSequence") {
              this.monthlySequence = res.data;
              this.handleMonthlySequenceSearch();
            } else {
              console.log("未定义的扫码类型");
            }
          }
        });
    },
    isAppEnvironment() {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      return (
        /iPad|iPhone|iPod/.test(userAgent) || // iOS devices
        /Android/.test(userAgent)
      );
    },
    // 查询检验项和问题
    getData(value) {
      window.dataItem(value, (data) => {
        console.log(data, "问题列表");
        if (data.code === "0") {
          // 保存原始数据
          this.originalData = { ...data };
          // 剔除code和msg
          delete this.originalData.code;
          delete this.originalData.msg;

          // 更新界面数据
          this.updateUIWithData(data);
          this.$message({
            message: "查询成功",
            type: "success",
            duration: 1000,
            showClose: true,
          });
        } else {
          this.$message({
            message: data.msg || "未知异常",
            type: "error",
            duration: 1000,
            showClose: true,
          });
        }
      });
    },
    // 使用查询返回的数据更新界面
    updateUIWithData(data) {
      // 更新输入框数据
      this.currentOrder = data.wipOrderNo || "";
      this.monthlySequence = data.monthSequence || "";
      this.frameNumber = data.vin || "";
      this.serialNo = data.serialNo || "";
      this.modelCode = data.productNo || "";

      // 更新检验项目表格数据
      this.inspectionList = (data.dispositionItem || []).map((item, index) => {
        // 根据status设置testAttribute
        let testAttribute = item.testAttribute === "OK" ? "OK" : "NG";
        return {
          ...item,
          index: index + 1,
          inspectionItem: item.dispositionDesc,
          testAttribute: testAttribute,
          pushStatus: 0,
        };
      });

      // 更新问题描述数据
      this.problemList = (data.questionItem || []).map((item) => {
        // 处理图片URL，将字符串分割为数组
        const imageUrls = item.imgs
          ? item.imgs.split(",").filter((url) => url.trim() !== "")
          : [];
        const imageList = imageUrls.map((url) => ({
          name: url.split("/").pop(),
          url: url,
        }));

        return {
          ...item,
          imageList: imageList,
          pushStatus: 0,
          autoHandle: item.autoHandle || 0,
          isFit: item.isFit || 0,
        };
      });
    },
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
    },
    // 构建查询参数
    buildQueryParams(type) {
      return {
        wipOrderNo: type === "wipOrderNo" ? this.searchParam : "",
        vin: type === "vin" ? this.frameNumber : "",
        monthSequence: type === "monthSequence" ? this.monthlySequence : "",
        workStation: this.currentUserWorkStationId,
      };
    },
    // 处理订单搜索
    handleOrderSearch() {
      if (
        !this.currentUserWorkStationId ||
        this.currentUserWorkStationId.trim() === ""
      ) {
        this.$message.warning("请先选择工位");
        return;
      }
      const params = this.buildQueryParams("wipOrderNo");
      this.getData(params);
    },
    // 处理月顺序号搜索
    handleMonthlySequenceSearch() {
      if (
        !this.currentUserWorkStationId ||
        this.currentUserWorkStationId.trim() === ""
      ) {
        this.$message.warning("请先选择工位");
        return;
      }
      const params = this.buildQueryParams("monthSequence");
      this.getData(params);
    },
    // 处理车架号搜索
    handleFrameNumberSearch() {
      if (
        !this.currentUserWorkStationId ||
        this.currentUserWorkStationId.trim() === ""
      ) {
        this.$message.warning("请先选择工位");
        return;
      }
      const params = this.buildQueryParams("vin");
      this.getData(params);
    },
    // 设置表格最大高度
    setTableMaxHeight() {
      this.tableMaxHeight = window.innerHeight / 3;
    },
    // 添加问题
    addProblem() {
      if (
        !this.currentUserWorkStationId ||
        this.currentUserWorkStationId.trim() === ""
      ) {
        this.$message.warning("请先选择工位");
        return;
      }
      const params = {
        flag: "AddQuestion",
        workStation: this.currentUserWorkStationId,
        wipOrderNo: this.currentOrder,
      };

      console.log(JSON.parse(JSON.stringify(params)), "添加问题参数");
      window.questionAdd(params, (response) => {
        console.log(response, "添加接口返回的数据");
        // 成功后，使用后端返回的数据创建新问题
        const serverProblem = {
          questionId: response.questionId,
          question: "",
          imgs: "",
          testBy: response.testBy,
          workCenter: response.workCenter,
          isHandle: 0,
          handleReMark: "",
          handImgs: "",
          handleBy: "",
          isClose: 0,
          confirmReMark: "",
          confirmImgs: "",
          confirmBy: "",
          imageList: [],
          autoHandle: 0,
        };

        // 添加到 problemList
        this.problemList.push(serverProblem);
        // 同时添加到 originalData
        if (!this.originalData.questionItem) {
          this.originalData.questionItem = [];
        }
        this.originalData.questionItem.push({ ...serverProblem });
        console.log(this.originalData.questionItem, "添加问题后的数据");
      });
    },
    // 删除问题
    removeProblem(question) {
      const params = {
        flag: "DelQuestion",
        questionId: question.questionId,
      };

      console.log(params, "删除数据");
      window.questionDel(params, (response) => {
        // 使用 filter 方法删除，避免索引问题
        this.problemList = this.problemList.filter(
          (problem) => problem.questionId !== response.questionId,
        );
        // 同时从 originalData 中删除
        if (this.originalData.questionItem) {
          this.originalData.questionItem =
            this.originalData.questionItem.filter(
              (item) => item.questionId !== response.questionId,
            );
        }
        console.log(this.originalData.questionItem, "删除问题后的数据");
      });
    },
    // 图片转Base64
    fileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    },
    // 上传单张图片
    async uploadSingleImage(base64Data, questionId) {
      return new Promise((resolve, reject) => {
        const params = {
          url: [base64Data],
          id: questionId,
          FilePicker: base64Data,
        };
        window.saveImgFils(params, (response) => {
          if (response && `${response.code}` === "0") {
            resolve(response.data);
          } else {
            reject(
              new Error(
                response?.msg || response?.message || "图片上传失败",
              ),
            );
          }
        });
      });
    },
    // 移除单张图片
    removeSingleImage(problem, imgIndex) {
      // 从图片列表中移除
      problem.imageList.splice(imgIndex, 1);
      // 更新imgs字段
      problem.imgs = problem.imageList.map((f) => f.url).join(",");
      // 同步到原始数据
      this.syncProblemData();
      this.$message({
        type: "success",
        message: "删除成功!",
        duration: 1000,
        showClose: true,
      });
    },
    // 图片预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    syncProblemData() {
      this.originalData.questionItem = this.problemList.map((problem) => {
        // 查找原始数据中是否已存在该问题
        const originalProblem =
          this.originalData.questionItem?.find(
            (p) => p.questionId === problem.questionId,
          ) || {};

        return {
          ...originalProblem,
          questionId: problem.questionId,
          question: problem.question,
          imgs: problem.imgs,
          imageList: problem.imageList,
          // 保留其他字段
          testBy: problem.testBy || originalProblem.testBy,
          workCenter: problem.workCenter || originalProblem.workCenter,
          isHandle: problem.isHandle || originalProblem.isHandle,
          handleReMark: problem.handleReMark || originalProblem.handleReMark,
          handImgs: problem.handImgs || originalProblem.handImgs,
          handleBy: problem.handleBy || originalProblem.handleBy,
          isClose: problem.isClose || originalProblem.isClose,
          confirmReMark: problem.confirmReMark || originalProblem.confirmReMark,
          confirmImgs: problem.confirmImgs || originalProblem.confirmImgs,
          confirmBy: problem.confirmBy || originalProblem.confirmBy,
          respDept: problem.respDept || originalProblem.respDept,
          respTeam: problem.respTeam || originalProblem.respTeam,
          respEmployee: problem.respEmployee || originalProblem.respEmployee,
          problemSource: problem.problemSource || originalProblem.problemSource,
          autoHandle:
            problem.autoHandle !== undefined
              ? problem.autoHandle
              : originalProblem.autoHandle || 0,
          isFit:
            problem.isFit !== undefined
              ? problem.isFit
              : originalProblem.isFit || 0,
        };
      });
    },
    // 处理问题输入变化
    handleProblemInputChange(problem, value) {
      // 同步到原始数据
      const originalProblem = this.originalData.questionItem.find(
        (p) => p.questionId === problem.questionId,
      );
      if (originalProblem) {
        originalProblem.question = value;
      }
    },
    // 是否自动处置变更
    onAutoHandleChange(problem) {
      if (problem.autoHandle === 1 || problem.autoHandle === "1") {
        this.$msgbox({
          title: "提示",
          message: "确定要自动处置吗？",
          showCancelButton: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          customClass: "my-message-box",
          showClose: false,
          closeOnPressEscape: false,
          closeOnClickModal: false,
        })
          .then(() => {
            // 用户确认，保持选择
            problem.autoHandle = 1;
          })
          .catch(() => {
            // 用户取消，重置为否
            problem.autoHandle = 0;
          });
      }
      // 同步到原始数据
      const originalProblem = this.originalData.questionItem.find(
        (p) => p.questionId === problem.questionId,
      );
      if (originalProblem) {
        originalProblem.autoHandle = problem.autoHandle;
      }
    },
    // 移动端图片上传处理
    handleMobileUpload(questionId) {
      // 创建两个文件输入元素
      const fileInputCamera = document.createElement("input");
      fileInputCamera.type = "file";
      fileInputCamera.accept = "image/*";
      fileInputCamera.capture = "environment"; // 强制使用相机
      // 设置z-index为最高层级
      fileInputCamera.style.position = "fixed";
      fileInputCamera.style.zIndex = "9999";

      const fileInputGallery = document.createElement("input");
      fileInputGallery.type = "file";
      fileInputGallery.accept = "image/*";
      fileInputGallery.multiple = true;
      // 设置z-index为最高层级
      fileInputGallery.style.position = "fixed";
      fileInputGallery.style.zIndex = "9999";

      const imgLength =
        this.problemList
          .find((problem) => problem.questionId === questionId)
          ?.imgs?.split(",") || [];

      // 检测是否为安卓设备
      const isAndroid = /Android/.test(navigator.userAgent);

      if (isAndroid) {
        // 安卓设备：直接调用相机
        fileInputCamera.onchange = async (event) => {
          const files = Array.from(event.target.files);
          if (files.length + imgLength.length > 30) {
            this.$message.warning(
              `最多只能上传30张图片，您已经选择了${imgLength.length}张，这次选择了${files.length}张`,
            );
            return;
          }
          await this.processSelectedFiles(files, questionId);
        };
        fileInputCamera.click();
      } else {
        // 非安卓设备：维持原有的对话框选择逻辑
        // 显示选择对话框
        this.$msgbox({
          title: "上传图片",
          message: "请选择图片来源",
          showCancelButton: true,
          showClose: false,
          closeOnPressEscape: false,
          closeOnClickModal: false,
          confirmButtonText: "拍照",
          cancelButtonText: "从相册选择",
        })
          .then(() => {
            // 用户选择拍照
            fileInputCamera.onchange = async (event) => {
              const files = Array.from(event.target.files);
              if (files.length + imgLength.length > 30) {
                this.$message.warning(
                  `最多只能上传30张图片，您已经选择了${imgLength.length}张，这次选择了${files.length}张`,
                );
                return;
              }
              await this.processSelectedFiles(files, questionId);
            };
            fileInputCamera.click();
          })
          .catch(() => {
            // 用户选择从相册选择
            fileInputGallery.onchange = async (event) => {
              const files = Array.from(event.target.files);
              if (files.length + imgLength.length > 30) {
                this.$message.warning(
                  `最多只能上传30张图片，您已经选择了${imgLength.length}张，这次选择了${files.length}张`,
                );
                return;
              }
              await this.processSelectedFiles(files, questionId);
            };
            fileInputGallery.click();
          });
      }
    },
    // 处理选中的文件
    async processSelectedFiles(files, questionId) {
      const problem = this.problemList.find((p) => p.questionId === questionId);
      if (!problem) return;
      this.$message({
        message: "图片上传中...",
        type: "info",
        duration: 1000,
        showClose: true,
      });
      try {
        // 处理每个选中的文件
        for (const file of files) {
          // 转换为base64
          const base64Data = await this.fileToBase64(file);
          // 上传图片
          const serverUrl = await this.uploadSingleImage(
            base64Data,
            questionId,
          );
          // 创建图片对象并添加到列表
          const newImage = {
            name: file.name,
            url: serverUrl,
            raw: file,
          };
          problem.imageList.push(newImage);
        }
        problem.imgs = problem.imageList.map((f) => f.url).join(",");
        this.syncProblemData();
        this.$message({
          message: "图片上传成功",
          type: "success",
          duration: 1000,
          showClose: true,
        });
      } catch (error) {
        console.error("图片上传失败:", error);
        this.$message({
          message: "图片上传失败: " + error.message,
          type: "error",
          duration: 1000,
          showClose: true,
        });
      }
    },
    // 图片预览缩放相关方法
    zoomIn() {
      this.previewScale *= 1.2;
    },
    zoomOut() {
      this.previewScale /= 1.2;
      if (this.previewScale < 0.1) {
        this.previewScale = 0.1;
      }
    },
    handleWheel(event) {
      if (event.deltaY < 0) {
        this.zoomIn();
      } else {
        this.zoomOut();
      }
    },
    resetPreviewTransform() {
      this.previewScale = 1;
      this.previewTranslateX = 0;
      this.previewTranslateY = 0;
    },
    fitPreviewImage() {
      this.resetPreviewTransform();
      this.$nextTick(() => {
        const image = this.$refs.previewImage;
        if (image && image.offsetWidth > 0 && image.offsetHeight > 0) {
          const scaleX = window.innerWidth / image.offsetWidth;
          const scaleY = window.innerHeight / image.offsetHeight;
          this.previewScale = Math.min(scaleX, scaleY);
        }
      });
    },
    onImageLoad() {
      this.fitPreviewImage();
    },
    // 触摸事件处理
    handleTouchStart(event) {
      if (event.touches.length === 2) {
        // 双指触摸，准备缩放
        this.startTouchDistance = this.getTouchDistance(event.touches);
        this.startTouchScale = this.previewScale;
      }
    },
    handleTouchMove(event) {
      if (event.touches.length === 2) {
        // 双指移动，执行缩放
        event.preventDefault();
        const currentDistance = this.getTouchDistance(event.touches);
        this.previewScale =
          this.startTouchScale * (currentDistance / this.startTouchDistance);

        // 限制缩放范围
        if (this.previewScale < 0.1) {
          this.previewScale = 0.1;
        } else if (this.previewScale > 10) {
          this.previewScale = 10;
        }
      }
    },
    handleTouchEnd() {
      // 重置触摸距离
      this.startTouchDistance = 0;
    },
    // 计算双指间距离
    getTouchDistance(touches) {
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    },
    // 打开工位选择对话框
    openWorkStationDialog() {
      this.workStationDialogVisible = true;
      this.selectedFactory = "";
      this.selectedProductionLine = "";
      this.selectedWorkStation = "";
      this.productionLineOptions = [];
      this.workStationOptions = [];
    },
    // 加载工厂列表
    loadFactories() {
      window.getFactory((res) => {
        if (res.code === "0") {
          this.factoryOptions = res.factories;
        }
      });
    },
    // 工厂选择变化
    onFactoryChange(factoryId) {
      this.selectedProductionLine = "";
      this.selectedWorkStation = "";
      this.productionLineOptions = [];
      this.workStationOptions = [];
      if (factoryId) {
        window.getProductionLine(factoryId, (res) => {
          if (res.code === "0") {
            this.productionLineOptions = res.productionLines;
          }
        });
      }
    },
    // 产线选择变化
    onProductionLineChange(productionLineId) {
      this.selectedWorkStation = "";
      this.workStationOptions = [];
      if (productionLineId) {
        window.getWorkStation(productionLineId, (res) => {
          if (res.code === "0") {
            this.workStationOptions = res.workStations;
          }
        });
      }
    },
    // 确认工位选择
    confirmWorkStationSelection() {
      if (!this.selectedWorkStation) {
        this.$message.warning("请选择工位");
        return;
      }
      const selectedStation = this.workStationOptions.find(
        (s) => s.id === this.selectedWorkStation,
      );
      const selectedName = `${
        this.factoryOptions.find((f) => f.id === this.selectedFactory)?.name
      }-${
        this.productionLineOptions.find(
          (l) => l.id === this.selectedProductionLine,
        )?.name
      }-${selectedStation.name}`;

      this.currentUserWorkStation = selectedStation.name;
      this.currentUserWorkStationId = selectedStation.id;

      // 同步到服务器
      if (typeof window.setCurrentUserWorkStation === "function") {
        window.setCurrentUserWorkStation(
          this.currentUserWorkStationId,
          (res) => {
            if (res && res.code === "0") {
              this.$message({
                message: "工位选择成功并已同步至服务器",
                type: "success",
                duration: 1000,
                showClose: true,
              });
            } else {
              this.$message({
                message:
                  (res && res.msg) ||
                  "工位选择成功，本地已更新（服务器同步失败）",
                type: "warning",
                duration: 1000,
                showClose: true,
              });
            }
          },
        );
      } else {
        this.$message({
          message: "工位选择成功（无同步接口，已本地保存）",
          type: "success",
          duration: 1000,
          showClose: true,
        });
      }

      this.workStationDialogVisible = false;
    },
  },
};
</script>

<style scoped lang="scss">
textarea {
  min-width: 85px !important;
}
:deep(.el-input__inner) {
  padding: 0 0.2rem;
}

.dl-conclusion {
  font-weight: bold;
  padding: 5px;
  border-radius: 4px;

  &.OK {
    color: #67c23a;
    background-color: #f0f9eb;
  }

  &.NG {
    color: #f56c6c;
    background-color: #fef0f0;
  }
}

.home {
  min-height: 100vh;
  overflow-y: auto;
  background-color: #f5f7fa;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 80px;
  box-sizing: border-box;
}

.user-workstation-display {
  width: 100%;
  max-width: 1080px;
  background: white;
  //border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  // margin-bottom: 20px;
  padding: 5px;
  display: flex;
  align-items: center;

  .workstation-label {
    font-size: 20px;
    color: #909399;
    margin-right: 10px;
  }

  .workstation-value {
    font-size: 20px;
    font-weight: 500;
    color: #303133;
  }
}

.collapse-container {
  position: relative;
  width: 100%;
  max-width: 1080px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.fixed-section {
  padding: 15px 5px;
  border-bottom: 1px solid #eaeaea;
  background: white;
}

.fixed-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.left-panel {
  flex: 1;
}

.right-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 15px;
}

.workstation-info {
  .label {
    font-size: 12px;
    color: #909399;
    margin-bottom: 4px;
  }

  .value {
    font-size: 16px;
    font-weight: 500;
    color: #303133;
    cursor: pointer;

    &:hover {
      color: #409eff;
      text-decoration: underline;
    }
  }

  .placeholder {
    font-size: 14px;
    color: #c0c4cc;
    cursor: pointer;

    &:hover {
      color: #409eff;
    }
  }
}

.order-input {
  width: 350px;
}

.toggle-icon {
  position: absolute;
  left: 50%;
  bottom: -18px;
  margin-left: -18px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #f5f7fa;
  color: #0a0a0a;
  cursor: pointer;

  &:hover {
    background: #e4e7ed;
  }
}

.collapsible-section {
  padding: 15px;
  background: white;
}

.collapsible-content {
  display: flex;
  margin-bottom: 20px;
  gap: 15px;
}

.workstation-select-section {
  margin-top: 15px;
}

.workstation-select-form {
  .form-row {
    display: flex;
    align-items: flex-start;
    margin-bottom: 20px;

    .form-label {
      width: 80px;
      font-size: 14px;
      color: #606266;
      margin-right: 10px;
      line-height: 40px;
    }

    .select-field {
      flex: 1;

      .el-select {
        width: 100%;
      }
    }
  }
}

.model-code-section {
  flex: 1;

  .section-title {
    font-size: 14px;
    color: #606266;
    margin-bottom: 8px;
  }

  .model-code {
    font-size: 16px;
    color: #303133;
    padding: 8px 12px;
    background: #f5f7fa;
    border-radius: 6px;
    min-height: 40px;
    display: flex;
    align-items: center;
  }

  .no-data {
    font-size: 14px;
    color: #c0c4cc;
    padding: 8px 12px;
    background: #f5f7fa;
    border-radius: 6px;
    text-align: center;
    min-height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.input-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.input-row {
  display: flex;
  flex-direction: column;

  .input-label {
    font-size: 14px;
    color: #606266;
    margin-bottom: 6px;
  }

  .input-field {
    width: 100%;
  }
}

.special-config-section {
  .section-title {
    font-size: 14px;
    color: #606266;
    margin-bottom: 8px;
  }

  .special-config {
    font-size: 16px;
    color: #303133;
    padding: 8px 12px;
    background: #f5f7fa;
    border-radius: 6px;
  }

  .no-data {
    font-size: 14px;
    color: #c0c4cc;
    padding: 8px 12px;
    background: #f5f7fa;
    border-radius: 6px;
    text-align: center;
  }
}

/* 展开/折叠动画 */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  max-height: 300px;
}

.slide-enter,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}

.inspection-container {
  width: 100%;
  max-width: 1080px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  margin-bottom: 20px;
}

.document-status {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  padding-top: 3px;

  .status-item {
    .status-label {
      font-size: 14px;
      color: #606266;
    }

    .status-value {
      font-size: 14px;
      font-weight: 500;
      color: #303133;
    }
  }
}

.inspection-table-container {
  margin-bottom: 15px;

  .inspection-table {
    width: 100%;
  }
}

.problem-section {
  margin-bottom: 15px;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    .section-title {
      font-size: 16px;
      font-weight: 500;
      color: #303133;
    }

    .add-btn {
      // padding: 6px 12px;
      background: #409eff !important;
      color: #ffff !important;
    }
  }

  .problem-list {
    .problem-item {
      border: 1px solid #eaeaea;
      border-radius: 6px;
      padding: 10px;
      margin-bottom: 10px;

      .problem-content {
        .problem-row {
          display: flex;
          align-items: flex-start;
          margin-bottom: 10px;

          .problem-label {
            width: 80px;
            font-size: 14px;
            color: #606266;
            line-height: 32px;
            flex-shrink: 0;
          }

          .problem-input {
            flex: 1;
            margin-right: 10px;
          }

          .remove-btn {
            flex-shrink: 0;
            background: #f56c6c !important;
            color: #fff !important;
          }

          .image-upload-section {
            flex: 1;
            position: relative;

            .image-upload-container {
              display: flex;
              align-items: flex-start;
              gap: 10px;
              width: 100%;

              /* 上传按钮样式 */
              .image-uploader {
                flex-shrink: 0;

                ::v-deep .el-upload--picture-card {
                  width: 80px;
                  height: 80px;
                  line-height: 80px;
                  border-radius: 6px;
                  border: 1px dashed #d9d9d9;
                  background-color: #fafafa;
                  display: flex;
                  align-items: center;
                  justify-content: center;

                  &:hover {
                    border-color: #409eff;
                  }

                  i {
                    font-size: 20px;
                    color: #8c939d;
                  }
                }

                /* 隐藏默认的图片列表 */
                ::v-deep .el-upload-list--picture-card {
                  display: none;
                }
              }

              /* 图片横向滚动容器 */
              .image-scroll-container {
                flex: 1;
                width: 100px;
                overflow-x: auto;
                overflow-y: hidden;
                padding-bottom: 5px;

                .image-list-horizontal {
                  display: flex;
                  gap: 10px;
                  width: max-content;
                  min-height: 82px;

                  .image-item {
                    position: relative;
                    width: 80px;
                    height: 80px;
                    flex-shrink: 0;
                    border-radius: 6px;
                    overflow: hidden;
                    border: 1px solid #eaeaea;
                    cursor: pointer;
                    transition: all 0.3s;

                    &:hover {
                      border-color: #409eff;

                      .image-actions {
                        opacity: 1;
                      }
                    }

                    .uploaded-image {
                      width: 100%;
                      height: 100%;
                      object-fit: cover;
                    }

                    .image-actions {
                      position: absolute;
                      top: 0;
                      right: 0;
                      background: rgba(0, 0, 0, 0.7);
                      border-radius: 0 0 0 6px;
                      padding: 2px;
                      opacity: 0;
                      transition: opacity 0.3s;

                      i {
                        color: white;
                        font-size: 14px;
                        padding: 2px;

                        &:hover {
                          color: #f56c6c;
                        }
                      }
                    }
                  }
                }
              }
            }

            .image-count {
              position: absolute;
              bottom: 5px;
              right: 5px;
              background: rgba(0, 0, 0, 0.5);
              color: white;
              padding: 2px 6px;
              border-radius: 10px;
              font-size: 12px;
            }
          }
        }
      }
    }
  }
}

.problem-row {
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;

  .problem-label {
    width: 80px;
    font-size: 14px;
    color: #606266;
    line-height: 32px;
    flex-shrink: 0;
  }

  .problem-input {
    flex: 1;
    margin-right: 10px;
  }

  .remove-btn {
    flex-shrink: 0;
    background: #f56c6c !important;
    color: #fff !important;
    padding-left: 10px;
    padding-right: 10px;
  }

  .push-btn {
    flex-shrink: 0;
    background: #409eff !important;
    color: #fff !important;
    padding-left: 5px !important;
    padding-right: 5px !important;
    margin-left: 5px !important;
  }

  .push-btn.is-disabled {
    flex-shrink: 0;
    background: #787878 !important;
    color: #fff !important;
    padding-left: 5px !important;
    padding-right: 5px !important;
    margin-left: 5px !important;
  }

  .image-upload-section {
    flex: 1;
    position: relative;

    .image-upload-container {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      width: 100%;

      /* 上传按钮样式 */
      .image-uploader {
        flex-shrink: 0;

        ::v-deep .el-upload--picture-card {
          width: 80px;
          height: 80px;
          line-height: 80px;
          border-radius: 6px;
          border: 1px dashed #d9d9d9;
          background-color: #fafafa;
          display: flex;
          align-items: center;
          justify-content: center;

          &:hover {
            border-color: #409eff;
          }

          i {
            font-size: 20px;
            color: #8c939d;
          }
        }

        /* 隐藏默认的图片列表 */
        ::v-deep .el-upload-list--picture-card {
          display: none;
        }
      }

      /* 图片横向滚动容器 */
      .image-scroll-container {
        flex: 1;
        width: 100px;
        overflow-x: auto;
        overflow-y: hidden;
        padding-bottom: 5px;

        .image-list-horizontal {
          display: flex;
          gap: 10px;
          width: max-content;
          min-height: 82px;

          .image-item {
            position: relative;
            width: 80px;
            height: 80px;
            flex-shrink: 0;
            border-radius: 6px;
            overflow: hidden;
            border: 1px solid #eaeaea;
            cursor: pointer;
            transition: all 0.3s;

            &:hover {
              border-color: #409eff;

              .image-actions {
                opacity: 1;
              }
            }

            .uploaded-image {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }

            .image-actions {
              position: absolute;
              top: 0;
              right: 0;
              background: rgba(0, 0, 0, 0.7);
              border-radius: 0 0 0 6px;
              padding: 2px;
              opacity: 0;
              transition: opacity 0.3s;

              i {
                color: white;
                font-size: 14px;
                padding: 2px;

                &:hover {
                  color: #f56c6c;
                }
              }
            }
          }
        }
      }
    }

    .image-count {
      position: absolute;
      bottom: 5px;
      right: 5px;
      background: rgba(0, 0, 0, 0.5);
      color: white;
      padding: 2px 6px;
      border-radius: 10px;
      font-size: 12px;
    }
  }
}

/* 移动端上传按钮样式 */
.mobile-upload-btn {
  width: 80px;
  height: 80px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  background-color: #fafafa;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;

  &:hover {
    border-color: #409eff;
  }

  i {
    font-size: 20px;
    color: #8c939d;
    margin-bottom: 5px;
  }

  .upload-text {
    font-size: 12px;
    color: #8c939d;
  }
}

/* 横向滚动条样式 */
.image-scroll-container::-webkit-scrollbar {
  height: 6px;
}

.image-scroll-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.image-scroll-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.image-scroll-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 底部固定按钮 */
.fixed-action-buttons {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 15px;
  background: white;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;

  .save-btn,
  .submit-btn {
    width: 100%;
    // padding: 12px;
    font-size: 16px;
  }

  .save-btn {
    background: #409eff !important;
    color: #fff !important;
  }

  .submit-btn {
    background: #67c23a !important;
    color: #fff !important;
  }
}

/* Element UI 输入框样式调整 */
::v-deep .el-input__inner {
  border-radius: 6px;
}

::v-deep .el-input__prefix {
  display: flex;
  align-items: center;
}

/* 表格样式调整 */
::v-deep .inspection-table .el-table__header-wrapper th {
  background-color: #f5f7fa;
  color: #606266;
  font-weight: 500;
  padding: 8px 0;
  /* 降低表头高度 */
}

/* 图片预览样式 */
.image-preview-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 100px);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.preview-image {
  max-width: 100%;
  max-height: 100%;
  transform-origin: center center;
}

.image-preview-toolbar {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  background: rgba(0, 0, 0, 0.7);
  padding: 10px;
  border-radius: 20px;
}

.toolbar-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  border: none;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #f0f0f0;
  }
}

.my-message-box {
  width: 0 !important;
}

::v-deep .inspection-table .el-table__body tr:hover > td {
  background-color: #f5f7fa;
}

/* 单选框组样式调整 */
.radio-group-container {
  display: flex;
  justify-content: center;
}

::v-deep .el-radio-group {
  display: flex;
  white-space: nowrap;
}

::v-deep .el-radio {
  margin-right: 8px;
}

/* 确保表格不出现水平滚动条 */
::v-deep .inspection-table .el-table {
  width: 100% !important;
}

::v-deep .inspection-table .el-table__body-wrapper {
  overflow-x: hidden;
}

::v-deep .inspection-table .el-table__header th:nth-child(2) {
  min-width: 220px;
}

/* 工位选择对话框样式调整 */
.dialog-footer {
  text-align: right;
  padding-top: 20px;
}
</style>

<style lang="scss">
.workstation-select-dropdown .el-select-dropdown__item {
  height: auto;
  min-height: 34px;
  white-space: normal;
  word-break: break-word;
  overflow-wrap: anywhere;
  line-height: 1.5;
  padding-top: 8px;
  padding-bottom: 8px;
}

.workstation-select-dropdown .el-select-dropdown__item span {
  white-space: normal;
  line-height: 1.5;
}
</style>
