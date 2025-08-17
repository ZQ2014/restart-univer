import { ChangeTrackerService } from "./change-tracker.service";

describe("ChangeTrackerService", () => {
  let service: ChangeTrackerService;
  let mockLogService: any;
  let mockUIUtils: any;
  let mockShowUnsavedChangeDialog: jasmine.Spy;

  beforeEach(() => {
    // 创建mock对象
    mockLogService = {
      log: jasmine.createSpy("log"),
      warn: jasmine.createSpy("warn"),
      error: jasmine.createSpy("error"),
    };

    mockUIUtils = {
      showNotification: jasmine.createSpy("showNotification"),
    };

    // 注入mock依赖后再创建服务实例
    service = new ChangeTrackerService();
    
    // 注入mock依赖
    (service as any)._logService = mockLogService;
    (service as any)._UIUtils = mockUIUtils;

    // 创建mock方法
    mockShowUnsavedChangeDialog = jasmine.createSpy("_showUnsavedChangeDialog");
    (service as any)._showUnsavedChangeDialog = mockShowUnsavedChangeDialog;
  });

  describe("_handleWorkbookOrWorksheetChange", () => {
    /**
     * 测试用例1: 正在更新数据时尝试切换
     * 预期行为: 显示警告通知并返回false
     */
    it("should show warning and return false when updating data", async () => {
      // Arrange: 设置正在更新状态
      (service as any)._isUpdating = true;
      (service as any)._currentSheetModified = false;

      // Act: 执行切换处理
      const result = await (service as any)._handleWorkbookOrWorksheetChange();

      // Assert: 验证警告日志和通知被调用，返回false
      expect(mockLogService.warn).toHaveBeenCalledWith(
        "[ChangeTrackerService]",
        "正在更新数据，请稍后再试"
      );
      expect(mockUIUtils.showNotification).toHaveBeenCalledWith(
        "提示：",
        "正在更新数据，请稍后再试！",
        "warning"
      );
      expect(result).toBe(false);
    });

    /**
     * 测试用例2: 没有未保存修改时直接允许切换
     * 预期行为: 直接返回true
     */
    it("should return true when no unsaved changes", async () => {
      // Arrange: 设置非更新状态且无修改
      (service as any)._isUpdating = false;
      (service as any)._currentSheetModified = false;

      // Act: 执行切换处理
      const result = await (service as any)._handleWorkbookOrWorksheetChange();

      // Assert: 验证直接返回true
      expect(result).toBe(true);
      // 确保没有调用警告或错误处理
      expect(mockLogService.warn).not.toHaveBeenCalled();
      expect(mockLogService.error).not.toHaveBeenCalled();
    });

    /**
     * 测试用例3: 有未保存修改且用户确认保存
     * 预期行为: 调用保存对话框并返回其结果(true)
     */
    it("should call showUnsavedChangeDialog and return true when user confirms", async () => {
      // Arrange: 设置非更新状态但有修改，mock对话框返回true
      (service as any)._isUpdating = false;
      (service as any)._currentSheetModified = true;
      mockShowUnsavedChangeDialog.and.resolveTo(true);

      // Act: 执行切换处理
      const result = await (service as any)._handleWorkbookOrWorksheetChange();

      // Assert: 验证对话框被调用并返回true
      expect(mockShowUnsavedChangeDialog).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    /**
     * 测试用例4: 有未保存修改且用户取消保存
     * 预期行为: 调用保存对话框并返回其结果(false)
     */
    it("should call showUnsavedChangeDialog and return false when user cancels", async () => {
      // Arrange: 设置非更新状态但有修改，mock对话框返回false
      (service as any)._isUpdating = false;
      (service as any)._currentSheetModified = true;
      mockShowUnsavedChangeDialog.and.resolveTo(false);

      // Act: 执行切换处理
      const result = await (service as any)._handleWorkbookOrWorksheetChange();

      // Assert: 验证对话框被调用并返回false
      expect(mockShowUnsavedChangeDialog).toHaveBeenCalled();
      expect(result).toBe(false);
    });

    /**
     * 测试用例5: 保存修改记录失败
     * 预期行为: 显示错误通知并返回false
     */
    it("should show error notification and return false when save fails", async () => {
      // Arrange: 设置非更新状态但有修改，mock对话框抛出异常
      (service as any)._isUpdating = false;
      (service as any)._currentSheetModified = true;
      const error = new Error("Save failed");
      mockShowUnsavedChangeDialog.and.rejectWith(error);

      // Act: 执行切换处理
      const result = await (service as any)._handleWorkbookOrWorksheetChange();

      // Assert: 验证错误日志和通知被调用，返回false
      expect(mockLogService.error).toHaveBeenCalledWith(
        "[ChangeTrackerService]",
        "保存修改记录失败",
        error
      );
      expect(mockUIUtils.showNotification).toHaveBeenCalledWith(
        "提示：",
        "保存修改记录失败！",
        "error"
      );
      expect(result).toBe(false);
    });
  });
});
