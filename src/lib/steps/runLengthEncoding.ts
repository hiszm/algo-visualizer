import type { Step } from '@/types/algorithm'

export function runLengthEncodingSteps(input: { text: string }): Step[] {
  const { text } = input
  const steps: Step[] = []

  if (text.length === 0) {
    steps.push({
      type: 'final',
      indices: [],
      pseudocodeLine: 0,
      message: '输入为空，编码结果为空',
      data: { original: text, encoded: '', currentChar: '', count: 0, position: -1 },
    })
    return steps
  }

  let encoded = ''
  let currentChar = text[0]
  let count = 1

  steps.push({
    type: 'visit',
    indices: [0],
    pseudocodeLine: 0,
    message: `从第一个字符 ${currentChar} 开始`,
    data: { original: text, encoded, currentChar, count, position: 0 },
  })

  for (let i = 1; i < text.length; i++) {
    const char = text[i]

    steps.push({
      type: 'compare',
      indices: [i - 1, i],
      pseudocodeLine: 1,
      message: `比较 ${text[i - 1]} 和 ${char}`,
      data: { original: text, encoded, currentChar, count, position: i },
    })

    if (char === currentChar) {
      count++
      steps.push({
        type: 'visit',
        indices: [i],
        pseudocodeLine: 2,
        message: `相同，${currentChar} 的计数增加到 ${count}`,
        data: { original: text, encoded, currentChar, count, position: i },
      })
    } else {
      encoded += `${currentChar}${count}`
      steps.push({
        type: 'swap',
        indices: [i],
        pseudocodeLine: 3,
        message: `不同，输出 ${currentChar}${count}，开始新的连续段 ${char}`,
        data: { original: text, encoded, currentChar, count, position: i },
      })
      currentChar = char
      count = 1
    }
  }

  encoded += `${currentChar}${count}`
  steps.push({
    type: 'final',
    indices: [],
    pseudocodeLine: 4,
    message: `编码完成：${encoded}`,
    data: { original: text, encoded, currentChar, count, position: text.length - 1 },
  })

  return steps
}
