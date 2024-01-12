import React, { CSSProperties } from "react";

type Props = {
    className?: string;
    style?: CSSProperties;
}
function Arrow(props: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="16"
      fill="none"
      style={props.style}
      className={props.className}
      viewBox="0 0 15 16"
    >
      <mask
        id="mask0_891_974"
        style={{ maskType: "alpha" }}
        width="15"
        height="16"
        x="0"
        y="0"
        maskUnits="userSpaceOnUse"
      >
        <path
          fill="#D9D9D9"
          d="M0 15.5H15V30.5H0z"
          transform="rotate(-90 0 15.5)"
        ></path>
      </mask>
      <g mask="url(#mask0_891_974)">
        <path
          fill="#003D6C"
          d="M13.75 5.5L7.5 11.75 1.25 5.5l1.11-1.11L7.5 9.532l5.14-5.14L13.75 5.5z"
        ></path>
      </g>
    </svg>
  );
}

export default Arrow;