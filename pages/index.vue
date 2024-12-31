<template>
  <div class="w-full h-screen flex flex-col bg-black overflow-hidden px-4">
    <div class="pt-6 px-2 flex flex-wrap justify-center">
      <ControlInput
        label="H-Sep"
        :value="horizontalSeparation"
        @update:value="(val) => (horizontalSeparation = val)"
        :min="0"
        :max="100"
      />
      <ControlInput
        label="V-Sep"
        :value="verticalSeparation"
        @update:value="(val) => (verticalSeparation = val)"
        :min="0"
        :max="100"
      />
      <ControlInput
        label="Width"
        :value="lineWidth"
        @update:value="(val) => (lineWidth = val)"
        :min="1"
        :max="50"
      />
      <ControlInput
        label="Height"
        :value="lineHeight"
        @update:value="(val) => (lineHeight = val)"
        :min="1"
        :max="10"
      />
      <ControlInput
        label="Rows"
        :value="rows"
        @update:value="(val) => (rows = val)"
        :min="1"
        :max="20"
      />
      <ControlInput
        label="Columns"
        :value="columns"
        @update:value="(val) => (columns = val)"
        :min="1"
        :max="50"
      />
    </div>
    <div class="flex-grow flex items-center justify-center">
      <div
        ref="containerRef"
        :style="gridStyle"
        @touchmove.prevent
      >
        <div
          v-for="(_, index) in rows * columns"
          :key="index"
          v-memo="[mousePosition.x, mousePosition.y, lineWidth, lineHeight, horizontalSeparation, verticalSeparation]"
          :style="getLineStyle(index)"
        />
      </div>
    </div>
    <div class="pb-4 text-center">
      <a
        href="https://x.com/verse_/status/1872711764800069989"
        target="_blank"
        rel="noopener noreferrer"
        class="text-gray-500 hover:text-gray-400 font-mono text-xs"
      >
        based on ab's work
      </a>
    </div>
  </div>
</template>

<script setup>
  import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
  import ControlInput from '~/components/control-input.vue';

  const containerRef = ref(null);
  const mousePosition = reactive({ x: 0, y: 0 });
  const horizontalSeparation = ref(20);
  const verticalSeparation = ref(20);
  const lineWidth = ref(25);
  const lineHeight = ref(2);
  const rows = ref(10);
  const columns = ref(20);

  const gridStyle = computed(() => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${columns.value}, ${lineWidth.value}px)`,
    gridTemplateRows: `repeat(${rows.value}, ${lineHeight.value}px)`,
    gap: `${verticalSeparation.value}px ${horizontalSeparation.value}px`,
    padding: '20px',
    backgroundColor: 'black',
    position: 'relative',
  }));

  const calculateRotationAndColor = (lineX, lineY) => {
    const dx = mousePosition.x - lineX;
    const dy = mousePosition.y - lineY;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    const distance = Math.sqrt(dx * dx + dy * dy);
    return { angle, distance };
  };

  const getColor = (distance) => {
    const maxDistance =
      Math.sqrt(
        (containerRef.value?.clientWidth || 500) ** 2 +
        (containerRef.value?.clientHeight || 500) ** 2
      );
    const intensity = Math.max(0, 1 - distance / (maxDistance * 0.3));
    const color = Math.round(60 + 215 * intensity);
    return `rgb(${color}, ${color}, ${color})`;
  };

  const getLineStyle = (index) => {
    const row = Math.floor(index / columns.value);
    const col = index % columns.value;
    const lineX = col * (lineWidth.value + horizontalSeparation.value) + lineWidth.value / 2;
    const lineY = row * (lineHeight.value + verticalSeparation.value) + lineHeight.value / 2;
    const { angle, distance } = calculateRotationAndColor(lineX, lineY);

    return {
      width: `${lineWidth.value}px`,
      height: `${lineHeight.value}px`,
      backgroundColor: getColor(distance),
      transform: `rotate(${angle}deg)`,
      transformOrigin: 'center',
      transition: 'transform 0.1s ease-out, background-color 0.1s ease-out',
    };
  };

  const handleMouseMove = (event) => {
    if (containerRef.value) {
      const rect = containerRef.value.getBoundingClientRect();
      mousePosition.x = event.clientX - rect.left;
      mousePosition.y = event.clientY - rect.top;
    }
  };

  onMounted(() => {
    window.addEventListener('mousemove', handleMouseMove);
  });

  onUnmounted(() => {
    window.removeEventListener('mousemove', handleMouseMove);
  });
</script>

