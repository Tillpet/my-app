# Next.js 国际化(i18n)基础设施搭建

你是一位资深 Next.js 架构师。

请在当前项目中集成 **next-intl**，要求符合 2026 年主流生产环境实践。

## 技术栈

- Next.js App Router
- TypeScript
- TailwindCSS
- shadcn/ui
- React Server Components

---

## 目标

完成一个最小可运行的国际化系统。

暂时不需要业务页面。

只需要：

- 完成 next-intl 配置
- 支持中文和英文
- 支持自动语言检测
- 支持语言切换
- 创建一个临时测试页面验证功能

---

## 支持语言

```ts
["zh", "en"];
```

默认语言：

```ts
zh;
```

---

## 目录结构要求

按照如下结构组织：

```txt
src
├─ app
│  └─ [locale]
│      ├─ layout.tsx
│      └─ page.tsx
│
├─ i18n
│  ├─ routing.ts
│  ├─ request.ts
│  └─ navigation.ts
│
├─ messages
│  ├─ zh.json
│  └─ en.json
│
└─ middleware.ts
```

---

## 翻译文件

### zh.json

```json
{
  "Common": {
    "title": "国际化测试页面",
    "description": "当前语言为中文",
    "switchLanguage": "切换语言"
  }
}
```

### en.json

```json
{
  "Common": {
    "title": "I18n Test Page",
    "description": "Current language is English",
    "switchLanguage": "Switch Language"
  }
}
```

---

## 测试页面要求

创建：

```txt
src/app/[locale]/page.tsx
```

页面内容：

- 标题
- 描述
- 当前 locale
- 中英文切换按钮

例如：

```txt
国际化测试页面

当前语言：zh

[切换到 English]
```

切换后：

```txt
I18n Test Page

Current language: en

[切换到 中文]
```

---

## 实现要求

必须使用：

### Server Component

页面翻译获取方式：

```ts
getTranslations();
```

### Client Component

语言切换按钮：

```ts
useLocale();
useRouter();
usePathname();
```

实现语言切换。

---

## Middleware

实现：

```txt
/
↓
自动重定向
↓
/zh
或
/en
```

根据浏览器语言自动识别。

---

## 验证要求

完成后请检查：

### URL

```txt
/zh
/en
```

均可访问。

### 自动跳转

访问：

```txt
/
```

能够自动跳转到对应语言。

### 页面翻译

标题和描述正确切换。

### 语言切换

按钮点击后切换 locale。

---

## 输出要求

请直接修改项目文件。

对于新增文件：

输出完整代码。

对于修改文件：

输出完整最终版本。

最后给出：

### 已新增文件

### 已修改文件

### 验证步骤

### 后续扩展建议

不要引入额外库。

不要实现 CMS。

不要实现翻译平台集成。

只完成 next-intl 的最小生产级基础设施搭建。
