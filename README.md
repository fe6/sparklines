# sparklines
> 迷你图

## Status: Pre-Alpha.

- 公共参数

| 完成度 | 描述 | 参数 | 类型 | 可选值 | 默认值 | 
| ----- | ---- | ---- | ---- | ---- | ---- |
| &#9745; | 设置宽度 | width | number | 无 | 'auto' |
| &#9745; | 设置高度 | height | number | 无 | 'auto' |
| &#9745; | 设置类型 | type | number | `line` | 'auto' |
| &#9745; | 数据可配置 | values | number[] | 无 | [] |

- 折线图(`type = line`)

| 完成度 | 描述 | 参数 | 类型 | 可选值 | 默认值 | 
| ----- | ---- | ---- | ---- | ---- | ---- |
| &#9745; | 所有点标记的半径，以像素为单位 | spotRadius | number | 无 | 1.5 |
| &#9745; | 图表中每个值的默认宽度均为3像素 | defaultPixelsPerValue | number | 无 | 3 |
| &#9745; | 最终值标记的CSS颜色。设置为空字符串将其隐藏 | spotColor | string | 无 | '#f80' |
| &#9745; | 指定当鼠标悬停在值上时显示在该值上的斑点的颜色。设置为空以禁用。 | highlightSpotColor | string | 无 | '#5f5' |
| &#9745; | 为最小值显示的标记的CSS颜色。设置为false或空字符串以将其隐藏 | minSpotColor | boolean | 无 | '#f80' |
| &#9745; | 为最大值显示的标记的CSS颜色。设置为false或空字符串以将其隐藏 | maxSpotColor | boolean | 无 | '#f80' |
| &#9744; | 为鼠标悬停时通过值显示的垂直线指定颜色。设置为null以禁用。 | highlightLineColor | string | 无 | '#f22' |
| &#9744; | 设置为true可禁用所有迷你图交互 | disableInteraction | boolean | 无 | false |
