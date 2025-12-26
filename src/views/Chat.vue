<template>
  <div class="chat-container">
    <div class="chat-header">
      <h3>AI 聊天助手</h3>
    </div>
    <div class="chat-messages" ref="messagesContainer">
      <div 
        v-for="(message, index) in messages" 
        :key="index" 
        :class="['message', message.sender]"
      >
        <div class="avatar">
          <span v-if="message.sender === 'user'">👤</span>
          <span v-else>🤖</span>
        </div>
        <div class="content">
          <div class="text">{{ message.text }}</div>
          <div class="time">{{ message.timestamp }}</div>
        </div>
      </div>
    </div>
    <div class="chat-input-area">
      <input
        v-model="inputMessage"
        @keyup.enter="sendMessage"
        placeholder="输入消息..."
        :disabled="isLoading"
      />
      <button @click="sendMessage" :disabled="isLoading">
        {{ isLoading ? '发送中...' : '发送' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';

// 响应式数据
const messages = ref([]);
const inputMessage = ref('');
const isLoading = ref(false);
const messagesContainer = ref(null);

// API 配置
const apiUrl = 'https://api.zhizengzeng.com/v1/chat/completions';
const apiKey = ''; // 你的 API 密钥
const model = 'gpt-3.5-turbo';

// 添加消息到聊天记录
const addMessage = (sender, text) => {
  const timestamp = new Date().toLocaleTimeString();
  messages.value.push({
    sender,
    text,
    timestamp
  });
};

// 获取 AI 响应
const getAIResponse = async (chatHistory) => {
  // 根据不同 API 格式化消息
  const formattedMessages = chatHistory.map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'assistant',
    content: msg.text
  }));

  // 示例：调用 OpenAI API
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 1000
    })
  });

  if (!response.ok) {
    throw new Error(`API 请求失败: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

// 发送消息
const sendMessage = async () => {
  if (!inputMessage.value.trim() || isLoading.value) {
    return;
  }

  // 添加用户消息
  const userMessage = inputMessage.value.trim();
  addMessage('user', userMessage);
  inputMessage.value = '';
  isLoading.value = true;

  try {
    // 调用 API 获取响应
    const response = await getAIResponse(messages.value);
    
    // 添加 AI 响应
    addMessage('assistant', response);
  } catch (error) {
    console.error('获取AI响应时出错:', error);
    addMessage('assistant', '抱歉，获取响应时出现问题，请稍后重试。');
  } finally {
    isLoading.value = false;
  }
};

// 监听消息变化，自动滚动到底部
watch(messages, async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
}, { deep: true });

// 组件挂载时添加欢迎消息
onMounted(() => {
  addMessage('assistant', '你好！我是AI助手，有什么可以帮助你的吗？');
});
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 800px;
  margin: 0 auto;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.chat-header {
  background-color: #4a6cf7;
  color: white;
  padding: 15px;
  text-align: center;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.message {
  display: flex;
  max-width: 80%;
  align-self: flex-start;
}

.message.user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.avatar {
  font-size: 24px;
  margin: 0 10px;
  display: flex;
  align-items: center;
}

.content {
  display: flex;
  flex-direction: column;
}

.text {
  padding: 10px 15px;
  border-radius: 18px;
  word-wrap: break-word;
  line-height: 1.5;
}

.message.user .text {
  background-color: #4a6cf7;
  color: white;
  border-bottom-right-radius: 4px;
}

.message.assistant .text {
  background-color: white;
  border: 1px solid #e0e0e0;
  border-bottom-left-radius: 4px;
}

.time {
  font-size: 0.7em;
  color: #999;
  margin-top: 5px;
  padding: 0 10px;
}

.chat-input-area {
  display: flex;
  padding: 15px;
  background-color: white;
  border-top: 1px solid #e0e0e0;
}

.chat-input-area input {
  flex: 1;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 20px;
  outline: none;
  font-size: 16px;
}

.chat-input-area input:focus {
  border-color: #4a6cf7;
}

.chat-input-area button {
  margin-left: 10px;
  padding: 12px 20px;
  background-color: #4a6cf7;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 16px;
}

.chat-input-area button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>