import { memo } from "react"

type SvgProps = React.ComponentPropsWithoutRef<"svg">

export const FontSizeIncreaseIcon = memo(({ className, ...props }: SvgProps) => {
  return (
    <svg
      width="24"
      height="24"
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <text
        x="4"
        y="18"
        fontSize="16"
        fontWeight="bold"
        fill="currentColor"
      >
        A
      </text>
      <text
        x="14"
        y="10"
        fontSize="14"
        fontWeight="bold"
        fill="currentColor"
      >
        +
      </text>
    </svg>
  )
})

FontSizeIncreaseIcon.displayName = "FontSizeIncreaseIcon"
