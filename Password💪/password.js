<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Day 4 - Password Strength Indicator</title>
  <!-- Link to the shared compiled stylesheet -->
  <link rel="stylesheet" href="../output.css" />
</head>
<body class="flex min-h-screen items-center justify-center bg-slate-950 p-4 font-sans text-slate-100 antialiased selection:bg-emerald-500 selection:text-slate-950">

  <main class="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
    
    <!-- Header -->
    <header class="mb-6 text-center">
      <span class="text-xs font-bold uppercase tracking-widest text-emerald-400">Security Check</span>
      <h1 class="mt-2 text-2xl font-extrabold tracking-tight text-white">Create a Password</h1>
      <p class="mt-1 text-xs text-slate-400">Enter a secure password to verify its strength.</p>
    </header>

    <!-- Password Input Field -->
    <div class="relative mb-5">
      <input
        type="password"
        id="password-input"
        placeholder="Type your password..."
        class="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 pr-20 text-sm text-white placeholder-slate-500 transition focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
      />
      <!-- Show/Hide Toggle Button -->
      <button
        type="button"
        id="toggle-visibility"
        class="absolute inset-y-0 right-0 flex items-center pr-3.5 text-xs font-semibold text-slate-400 transition hover:text-white cursor-pointer"
      >
        Show
      </button>
    </div>

    <!-- Strength Meter Visual Bar -->
    <div class="mb-4">
      <div class="flex items-center justify-between text-xs font-medium text-slate-400 mb-1.5">
        <span>Strength</span>
        <span id="strength-label" class="font-semibold text-slate-500">None</span>
      </div>
      <!-- Track -->
      <div class="h-2 w-full overflow-hidden rounded-full bg-slate-800">
        <!-- Animated Bar Fill -->
        <div id="strength-bar" class="h-full w-0 transition-all duration-300 ease-out bg-transparent"></div>
      </div>
    </div>

    <!-- Criteria Checklist -->
    <ul class="space-y-2 rounded-xl border border-slate-800/80 bg-slate-950/40 p-4 text-xs font-medium">
      <li id="rule-length" class="flex items-center gap-2 text-slate-500 transition-colors">
        <span class="status-icon inline-block w-4 text-center">○</span>
        <span>At least 8 characters</span>
      </li>
      <li id="rule-upper" class="flex items-center gap-2 text-slate-500 transition-colors">
        <span class="status-icon inline-block w-4 text-center">○</span>
        <span>Includes uppercase letter (A-Z)</span>
      </li>
      <li id="rule-number" class="flex items-center gap-2 text-slate-500 transition-colors">
        <span class="status-icon inline-block w-4 text-center">○</span>
        <span>Includes a number (0-9)</span>
      </li>
      <li id="rule-special" class="flex items-center gap-2 text-slate-500 transition-colors">
        <span class="status-icon inline-block w-4 text-center">○</span>
        <span>Includes a special character (!@#$%^&*)</span>
      </li>
    </ul>

  </main>

  <script src="script.js"></script>
</body>
</html>