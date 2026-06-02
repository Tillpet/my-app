你是一位资深前端架构师，请帮我重构当前的 Tailwind CSS v4 主题系统。

## 目标

将「主题（Theme）」与「明暗模式（Light/Dark Mode）」彻底解耦。

当前系统存在以下问题：

- 使用 `.dark`
- 使用 `[data-theme="blue"]`
- 使用 `[data-theme="blue"].dark`
- 每新增一个主题都需要再写一套 dark 版本
- 出现 Theme × Mode 的组合爆炸

例如：

```css
:root {
}
.dark {
}

[data-theme="blue"] {
}
[data-theme="blue"].dark {
}

[data-theme="green"] {
}
[data-theme="green"].dark {
}
```

请重构为可无限扩展的设计。

---

## 架构要求

Theme 与 Mode 必须是两个独立维度。

最终支持：

```html
<html data-theme="default">
  <html data-theme="blue">
    <html data-theme="green">
      <html class="dark">
        <html class=""></html>
      </html>
    </html>
  </html>
</html>
```

并允许任意组合：

```html
<html data-theme="blue" class="dark">
  <html data-theme="green" class="dark">
    <html data-theme="blue"></html>
  </html>
</html>
```

不允许出现：

```css
[data-theme="blue"].dark
[data-theme="green"].dark
```

这种组合选择器。

---

## Mode（亮暗模式）职责

Light/Dark 只负责以下语义颜色：

```txt
background
foreground

card
card-foreground

popover
popover-foreground

muted
muted-foreground

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

这些变量必须只出现在：

```css
:root
.dark
```

中。

---

## Theme（品牌主题）职责

Theme 只负责品牌和视觉风格相关变量：

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

例如：

```css
[data-theme="default"] {
}

[data-theme="blue"] {
}

[data-theme="green"] {
}

[data-theme="purple"] {
}
```

不同主题可以拥有不同主色和图表色。

---

## Tailwind v4 要求

保留：

```css
@theme inline
@layer theme
@layer base
@layer components
@layer utilities;
```

结构。

使用：

```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);

  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);

  ...
}
```

映射 Tailwind Token。

---
