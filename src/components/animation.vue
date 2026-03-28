<template>
  <div class="growth-container">
    <!-- 控制面板 -->
    <!-- <div class="controls">
      <button @click="reset">重置</button>
      <button @click="autoGrow">自动生长</button>
      <input type="range" v-model="growth" min="0" max="100" />
      <span>生长进度: {{ growth }}%</span>
    </div> -->

    <!-- 植物 SVG -->
    <svg viewBox="0 0 200 200" width="300" height="300" class="plant-svg">
      <!-- 土地层 -->
      <rect x="0" y="160" width="200" height="40" fill="#6d4c41" />
      
      <!-- 根部 (向下的虚线/实线) -->
      <path
        v-if="growth > 10"
        d="M 100 165 Q 100 185 90 195"
        fill="none"
        stroke="#8d6e63"
        stroke-width="2"
        :style="pathStyle(10, 40)"
      />

      <!-- 茎部 (向上生长) -->
      <path
        id="stem"
        d="M 100 165 Q 105 120 100 80"
        fill="none"
        stroke="#4caf50"
        stroke-width="4"
        stroke-linecap="round"
        :style="pathStyle(20, 100)"
      />

      <!-- 左叶子 -->
      <g :style="leafStyle(60)">
        <path
          d="M 100 80 Q 70 70 65 90 Q 85 100 100 80"
          fill="#81c784"
        />
      </g>

      <!-- 右叶子 -->
      <g :style="leafStyle(70)">
        <path
          d="M 100 80 Q 130 70 135 90 Q 115 100 100 80"
          fill="#4caf50"
        />
      </g>

      <!-- 种子瓣 -->
      <ellipse
        cx="100"
        cy="162"
        :rx="seedSize.x"
        :ry="seedSize.y"
        fill="#a1887f"
        :class="{ 'seed-shake': growth > 0 && growth < 20 }"
        :style="seedStyle"
      />
    </svg>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const growth = ref(0);

// 1. 计算种子状态
const seedSize = computed(() => {
  if (growth.value > 50) return { x: 0, y: 0 }; // 生长后消失
  return { x: 8, y: 5 };
});

const seedStyle = computed(() => ({
  transform: `scale(${1 - growth.value / 100})`,
  transformOrigin: '100px 162px',
  transition: 'all 0.3s ease'
}));

// 2. 通用的路径生长动画函数
// start: 开始生长的进度百分比, end: 结束生长的进度百分比
const pathStyle = (start, end) => {
  const progress = Math.max(0, Math.min(100, ((growth.value - start) / (end - start)) * 100));
  return {
    strokeDasharray: '100',
    strokeDashoffset: 100 - progress,
    transition: 'stroke-dashoffset 0.1s linear'
  };
};

// 3. 叶子展示动画
const leafStyle = (threshold) => {
  const isVisible = growth.value > threshold;
  const scale = isVisible ? (growth.value - threshold) / (100 - threshold) : 0;
  return {
    transform: `scale(${scale})`,
    transformOrigin: '100px 80px',
    opacity: isVisible ? 1 : 0,
    transition: 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
  };
};

// 交互逻辑
const autoGrow = () => {
  growth.value = 0;
  const timer = setInterval(() => {
    if (growth.value < 100) {
      growth.value += 1;
    } else {
      clearInterval(timer);
    }
  }, 50);
};

const reset = () => {
  growth.value = 0;
};
</script>

<style scoped>
.growth-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  /* background: #f0f4f8; */
  border-radius: 12px;
}

.controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.plant-svg {
  background: white;
  border-radius: 50%;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

/* 种子震动动画 */
.seed-shake {
  animation: shake 0.2s infinite;
}

@keyframes shake {
  0% { transform: translate(0, 0); }
  25% { transform: translate(1px, 0); }
  75% { transform: translate(-1px, 0); }
  100% { transform: translate(0, 0); }
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background: #4caf50;
  color: white;
  cursor: pointer;
}

button:hover {
  background: #45a049;
}
</style>