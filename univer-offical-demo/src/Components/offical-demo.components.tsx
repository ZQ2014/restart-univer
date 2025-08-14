import { Loading, SaveSingle } from "@univerjs/icons";
import React from "react";

// export function HelloComponent() {
//   return <div>Hello Univer !</div>;
// }
export function HelloComponent(props?: Record<string, any>) {
  return <div>Hello {props?.name || "Univer"}!</div>;
}

export function SaveSingleComponent() {
  return (
    <SaveSingle
      style={{
        color: "#3526de",
        fontSize: "48px",
      }}
    />
  );
}

// export function LoadingComponent() {
//   return <Loading style={{ fontSize: "48px" }} />;
// }
export const LoadingComponent = (props?: Record<string, any>) => {
  return <Loading style={{ fontSize: props?.size || "48px" }} />;
};

export const RangeLoadingComponent = () => {
  const divStyle = {
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    boxSizing: "border-box" as const,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center" as const,
    transformOrigin: "top left",
  };

  return <div style={divStyle}>加载中...</div>;
};

export const ButtonIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2m.16 14a6.981 6.981 0 0 0-5.147 2.256A7.966 7.966 0 0 0 12 20a7.97 7.97 0 0 0 5.167-1.892A6.979 6.979 0 0 0 12.16 16M12 4a8 8 0 0 0-6.384 12.821A8.975 8.975 0 0 1 12.16 14a8.972 8.972 0 0 1 6.362 2.634A8 8 0 0 0 12 4m0 1a4 4 0 1 1 0 8a4 4 0 0 1 0-8m0 2a2 2 0 1 0 0 4a2 2 0 0 0 0-4"
      />
    </svg>
  );
};

export const PopupComponent = () =>
  React.createElement(
    "div",
    {
      style: {
        color: "red",
        fontSize: "14px",
      },
    },
    "Custom Popup"
  );

export const RangePopupComponent = () =>
  React.createElement(
    "div",
    {
      style: {
        background: "red",
        fontSize: "14px",
      },
    },
    "Custom Popup"
  );
