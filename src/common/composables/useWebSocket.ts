// src/composables/useWebSocket.ts
export function useWebSocket(url: string) {
  const socket = ref<WebSocket | null>(null)
  const messages = ref<any[]>([])

  // 连接 WebSocket
  const connect = () => {
    socket.value = new WebSocket(url)

    const ws = socket.value

    ws.onopen = () => {
      console.log("WebSocket连接已建立")
    }

    ws.onmessage = (event: MessageEvent) => {
      messages.value.push(event.data)
      console.log("收到消息:", event.data)
    }

    ws.onclose = () => {
      console.log("WebSocket连接已关闭")
    }

    ws.onerror = (error: Event) => {
      console.error("WebSocket错误:", error)
    }
  }

  // 发送消息
  const sendMessage = (message: string) => {
    if (socket.value?.readyState === WebSocket.OPEN) {
      socket.value.send(message)
      console.log("发送消息:", message)
    } else {
      console.error("WebSocket未连接")
    }
  }

  // 清理 WebSocket 连接
  onUnmounted(() => {
    if (socket.value) {
      socket.value.close()
    }
  })

  onMounted(() => {
    connect() // 在组件挂载时连接 WebSocket
  })

  return { socket, messages, sendMessage }
}
