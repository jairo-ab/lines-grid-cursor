<template>
  <div class="flex items-center mr-4 mb-2">
    <label class="mr-2 text-gray-500 font-mono text-xs">{{ label }}</label>
    <div
      ref="inputRef"
      class="w-12 text-center py-1 text-gray-500 font-mono text-xs cursor-ew-resize select-none"
      :class="{ 'text-white': isDragging }"
      @mousedown="handleStart($event.clientX)"
      @touchstart="handleStart($event.touches[0].clientX)"
    >
      {{ value }}
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted, onUnmounted } from 'vue';

export default {
  props: {
    label: String,
    value: Number,
    min: Number,
    max: Number,
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    const isDragging = ref(false);
    const inputRef = ref(null);
    const startXRef = ref(0);
    const startValueRef = ref(props.value);

    const handleStart = (clientX) => {
      isDragging.value = true;
      startXRef.value = clientX;
      startValueRef.value = props.value;
    };

    const handleMove = (clientX) => {
      if (isDragging.value) {
        const sensitivity = 0.5;
        const delta = (clientX - startXRef.value) * sensitivity;
        const range = props.max - props.min;
        const newValue = Math.round(startValueRef.value + (delta / 100) * range);
        emit('update:value', Math.max(props.min, Math.min(props.max, newValue)));
      }
    };

    const handleEnd = () => {
      isDragging.value = false;
    };

    const handleMouseMove = (e) => handleMove(e.clientX);
    const handleTouchMove = (e) => handleMove(e.touches[0].clientX);

    onMounted(() => {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchend', handleEnd);
    });

    onUnmounted(() => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchend', handleEnd);
    });

    watch(() => props.value, (newValue) => {
      startValueRef.value = newValue;
    });

    return {
      isDragging,
      inputRef,
      handleStart,
    };
  },
};
</script>
