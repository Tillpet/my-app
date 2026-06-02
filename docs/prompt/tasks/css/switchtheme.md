# 重构 Tailwind v4 主题系统（Theme 与 Mode 解耦）

你是一位资深前端架构师，请帮我重构当前项目的主题系统。

技术栈：

- Next.js App Router
- Tailwind CSS v4
- TypeScript
- shadcn/ui
- Zustand
- next-themes（可选）

---

# 目标

将主题系统重构为两个完全正交的维度：

## Mode（界面模式）

负责：

```txt
light
dark
system
```

用于控制：

```txt
background
foreground

card
card-foreground

popover
popover-foreground

muted
muted-foreground

accent
accent-foreground

border
input
ring

sidebar
sidebar-foreground

sidebar-accent
sidebar-accent-foreground

sidebar-border
sidebar-ring
```

---

## Theme（品牌主题）

负责：

```txt
default
blue
green
purple
```

用于控制：

```txt
primary
primary-foreground

sidebar-primary
sidebar-primary-foreground

chart-1
chart-2
chart-3
chart-4
chart-5
```

---

# 设计原则

Theme 与 Mode 必须完全解耦。

允许：

```html
<html data-mode="light" data-theme="default">
  <html data-mode="dark" data-theme="default">
    <html data-mode="light" data-theme="blue">
      <html data-mode="dark" data-theme="blue"></html>
    </html>
  </html>
</html>
```

禁止：

```css
[data-theme="blue"].dark
[data-theme="green"].dark
[data-theme="purple"].dark
```

这种 Theme × Mode 的组合选择器。

---

# CSS 要求

保留：

```css
@import "tailwindcss";

@theme inline {
}

@layer theme {
}

@layer base {
}

@layer components {
}

@layer utilities {
}
```

结构。

---

# Theme Layer 规范

Mode：

```css
:root
[data-mode="dark"]
```

只允许出现：

```txt
background
foreground

card
popover

muted
accent

border
input
ring

sidebar
sidebar-accent
sidebar-border
sidebar-ring
```

---

Theme：

```css
[data-theme="default"]
[data-theme="blue"]
[data-theme="green"]
[data-theme="purple"]
```

只允许出现：

```txt
primary
primary-foreground

sidebar-primary
sidebar-primary-foreground

chart-1
chart-2
chart-3
chart-4
chart-5
```

---

# 状态管理

请使用 Zustand。

创建：

```txt
src/store/theme-store.ts
```

状态结构：

```ts
type ThemeMode = "light" | "dark" | "system";

type ThemeName = "default" | "blue" | "green" | "purple";

interface ThemeState {
  mode: ThemeMode;
  theme: ThemeName;
}
```

要求：

- 支持切换 mode
- 支持切换 theme
- 自动同步到 html
- 自动持久化 localStorage

---

# DOM 同步要求

最终 html 必须保持：

```html
<html data-mode="dark" data-theme="blue"></html>
```

或者：

```html
<html data-mode="light" data-theme="green"></html>
```

不要使用：

```html
<html class="dark"></html>
```

统一使用：

```html
data-mode data-theme
```

两个属性。

---

# System Mode

支持：

```txt
system
```

行为：

```txt
system
    ↓
读取 prefers-color-scheme
    ↓
自动切换
```

最终同步：

```html
data-mode="dark"
```

或：

```html
data-mode="light"
```

---

# Provider 要求

创建：

```txt
src/providers/theme-provider.tsx
```

职责：

- 初始化主题
- 初始化模式
- localStorage 恢复
- system mode 监听
- html 属性同步

---

# UI 要求

生成：

```txt
src/components/theme/theme-switcher.tsx
```

包含：

## Theme Selector

```txt
Default
Blue
Green
Purple
```

---

## Mode Selector

```txt
Light
Dark
System
```

使用 shadcn/ui 实现。

---

# Tailwind 映射要求

使用：

```css
@theme inline;
```

映射所有变量。

包括：

```txt
background
foreground

primary
primary-foreground

secondary
secondary-foreground

accent
accent-foreground

destructive
destructive-foreground

border
input
ring

card
card-foreground

popover
popover-foreground

muted
muted-foreground

sidebar
sidebar-primary
sidebar-accent

chart-1
chart-2
chart-3
chart-4
chart-5
```

---

# 输出内容

请直接生成：

## 1.

完整目录结构

## 2.

完整 globals.css

## 3.

完整 Zustand Store

## 4.

完整 ThemeProvider

## 5.

完整 ThemeSwitcher

## 6.

Next.js App Router 接入代码

## 7.

最佳实践说明

解释：

- 为什么 Theme 与 Mode 要解耦
- 为什么使用 data-mode 而不是 .dark
- 为什么使用 data-theme
- 如何扩展到 10+ 主题
- 如何兼容 shadcn/ui
- 如何兼容 Tailwind CSS v4

代码必须符合 2026 年生产级项目最佳实践。
