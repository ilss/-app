### ty-keyboard-number
#### 使用说明
  | 参数 | 说明 | 默认值 |
  |---|---|---|
  | defaultPassword | 默认值 | ` ` |
  | keyNeedRandom |  | `false` |
  | @confirm | 输入完成后回调 | ` ` |
#### 示例
  ```html
 <ty-keyboard-number
   ref="code"
   @confirm="enterExam"
 ></ty-keyboard-number>
  ```