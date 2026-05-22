# AXIPAYS — Payment Platform

A full-stack Next.js 16 payment platform with a dark premium UI theme, featuring a checkout page with 3D animated card preview and a real-time transaction dashboard.

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 16** | React framework with App Router |
| **React 19** | UI library |
| **TypeScript** | Type safety |
| **Tailwind CSS v4** | Utility-first styling |
| **Framer Motion** | Animations (page transitions, card flip, counters) |
| **Recharts** | Dashboard charts (Area, Donut) |
| **React Hook Form + Zod** | Form validation with schema-based rules |
| **TanStack Query** | Server state management |
| **Axios** | HTTP client |
| **crypto-js** | HMAC-SHA256 hash generation |
| **Sonner** | Toast notifications |
| **Lucide React** | Icons |

## 📁 Folder Structure

```
src/
  app/
    layout.tsx              ← Root layout with Inter font + Sonner
    page.tsx                ← Redirects to /checkout
    providers.tsx           ← QueryProvider + Navbar + Toaster
    globals.css             ← Dark premium design system
    checkout/
      page.tsx              ← Payment checkout page
    dashboard/
      page.tsx              ← Dashboard + transactions
  components/
    checkout/
      CheckoutForm.tsx      ← Full checkout form with validation
      CardPreview.tsx       ← Animated 3D card flip preview
      PaymentModal.tsx      ← Redirect handler + status modal
    dashboard/
      SummaryCards.tsx       ← Animated counter stat cards
      TransactionTable.tsx  ← Sortable, searchable, paginated table
      Charts/
        StatusDonut.tsx     ← Transaction status donut chart
        VolumeChart.tsx     ← Volume over time area chart
        CurrencyDonut.tsx   ← Currency distribution donut chart
    ui/
      GlassCard.tsx         ← Glassmorphism card component
      AnimatedBadge.tsx     ← Status badge with entrance animation
      CounterNumber.tsx     ← Animated number counter
      Navbar.tsx            ← Gradient logo nav with mobile menu
      Button.tsx            ← Gradient button with loading states
      Input.tsx             ← Dark themed input with focus glow
      Select.tsx            ← Dark themed select dropdown
      Modal.tsx             ← Glassmorphism modal with AnimatePresence
      Skeleton.tsx          ← Loading skeleton components
  lib/
    hash.ts                 ← HMAC-SHA256 hash generation (crypto-js)
    luhn.ts                 ← Luhn algorithm + card utilities
    api.ts                  ← Axios instance + API calls
  types/
    payment.ts              ← Payment types
    transaction.ts          ← Transaction + dashboard types
```

## 🔐 Hash Generation (Step by Step)

The API requires an HMAC-SHA256 hash sent as a `Hash` header:

```
1. Extract first 6 digits from card number
2. Extract last 4 digits from card number
3. Concatenate: first6 + last4 (10 digits)
4. Reverse the 10-digit string
5. Reverse the email address
6. Build message: (reversedEmail + "AXIPAYS" + reversedCard).toUpperCase()
7. Generate HMAC-SHA256 using key "AXI2026"
8. Convert to uppercase hexadecimal string
```

**Example:**
- Card: `4111111111111111` → first6=`411111`, last4=`1111`
- Combined: `4111111111` → Reversed: `1111111114`
- Email: `test@example.com` → Reversed: `moc.elpmaxe@tset`
- Message: `MOC.ELPMAXE@TSETAXIPAYS1111111114`
- Hash: HMAC-SHA256(message, "AXI2026") → uppercase hex

## ✅ Luhn Algorithm

The Luhn algorithm validates credit card numbers:

1. Starting from the rightmost digit, double every second digit
2. If doubling results in a number > 9, subtract 9
3. Sum all digits
4. If total modulo 10 equals 0, the number is valid

This runs on form submission before the API call.

## 🚀 How to Run Locally

```bash
# Install dependencies
npm install

# Create .env.local
echo "NEXT_PUBLIC_API_BASE_URL=https://payment-assignment.onrender.com" > .env.local

# Start development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to the checkout page.

## 🌐 Environment Variables

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Payment API base URL | `https://payment-assignment.onrender.com` |

## 🎨 Design Decisions

- **Dark Premium Theme**: Deep backgrounds (#0a0a0f, #0f0f1a) with electric violet (#6c63ff) and cyan (#00d2ff) accents create a premium fintech feel
- **Glassmorphism**: Cards use `rgba(255,255,255,0.03)` background with `backdrop-filter: blur(20px)` for depth
- **3D Card Preview**: CSS `perspective` + Framer Motion `rotateY` creates a realistic card flip when CVV is focused
- **Animated Counters**: Dashboard summary numbers count up on mount using Framer Motion springs
- **crypto-js**: Used for client-side HMAC-SHA256 hash generation (no server-side processing needed)

## 📦 Deployment

This is a standard Next.js app deployable to Vercel, Netlify, or any Node.js host:

```bash
npm run build
npm start
```

Ensure `NEXT_PUBLIC_API_BASE_URL` is set in your deployment environment variables.
