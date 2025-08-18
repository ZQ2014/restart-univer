import {
  ErrorIcon,
  ExportIcon,
  InfoIcon,
  LoadingMultiIcon,
  SuccessIcon,
  WarningIcon,
} from "@univerjs/icons";
import {
  COMPONENT_ERROR_ICON,
  COMPONENT_EXPORT_ICON,
  COMPONENT_INFO_ICON,
  COMPONENT_LOADING_MULTI_ICON,
  COMPONENT_SUCESS_ICON,
  COMPONENT_WARNING_ICON,
} from "../common/const";

export const CHANGE_TRACKER_COMPONENTS = new Map([
  [COMPONENT_ERROR_ICON, ErrorIcon],
  [COMPONENT_EXPORT_ICON, ExportIcon],
  [COMPONENT_INFO_ICON, InfoIcon],
  [COMPONENT_LOADING_MULTI_ICON, LoadingMultiIcon],
  [COMPONENT_SUCESS_ICON, SuccessIcon],
  [COMPONENT_WARNING_ICON, WarningIcon],
]);
