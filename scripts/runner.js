#!/usr/bin/env node
const readline = require('readline');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function displayMenu() {
  console.clear();
  console.log(`
╔═══════════════════════════════════════════════════════════════════╗
║         🚀 ENTERPRISE PLAYWRIGHT & AI AUTOMATION RUNNER           ║
╚═══════════════════════════════════════════════════════════════════╝

  [1] ⚡ Run Fast Smoke Tests (@smoke)
  [2] 🤖 Run AI Self-Healing & Security Fuzzing Suite
  [3] 🔄 Run Full Regression Suite (@regression)
  [4] ♿ Run Accessibility Audits (WCAG 2.1 AA)
  [5] 📈 Run Web Performance & Vitals Benchmarks
  [6] 🌐 Run Network Fault Injection & Mocking
  [7] 🖥️  Launch Interactive Playwright UI Mode
  [8] 🔍 Run TypeCheck & Lint (tsc --noEmit)
  [9] 📊 Open HTML Test Report
  [0] ❌ Exit

═════════════════════════════════════════════════════════════════════
  `);

  rl.question('  👉 Enter your choice [0-9]: ', (choice) => {
    handleChoice(choice.trim());
  });
}

function runCommand(command) {
  try {
    console.log(`\n⏳ Executing: ${command}\n`);
    execSync(command, { stdio: 'inherit' });
    console.log('\n✅ Execution finished successfully.');
  } catch (error) {
    console.error('\n❌ Execution finished with errors.');
  }

  rl.question('\nPress ENTER to return to menu...', () => {
    displayMenu();
  });
}

function handleChoice(choice) {
  switch (choice) {
    case '1':
      runCommand('npx playwright test --grep @smoke');
      break;
    case '2':
      runCommand('npx playwright test src/tests/ai');
      break;
    case '3':
      runCommand('npx playwright test --grep @regression');
      break;
    case '4':
      runCommand('npx playwright test src/tests/accessibility');
      break;
    case '5':
      runCommand('npx playwright test src/tests/performance');
      break;
    case '6':
      runCommand('npx playwright test src/tests/network');
      break;
    case '7':
      runCommand('npx playwright test --ui');
      break;
    case '8':
      runCommand('npx tsc --noEmit');
      break;
    case '9':
      runCommand('npx playwright show-report');
      break;
    case '0':
      console.log('\n👋 Exiting runner. Happy Testing!\n');
      rl.close();
      process.exit(0);
      break;
    default:
      console.log('\n⚠️ Invalid choice. Please select 0 to 9.');
      setTimeout(displayMenu, 1500);
      break;
  }
}

displayMenu();
