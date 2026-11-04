const passwordInput = document.getElementById('passwordInput');
const toggleButton = document.getElementById('toggleButton');
const strengthBar = document.getElementById('StrengthBar');
const strengthLabel = document.getElementById('StrengthLabel');
const ruleLength = document.getElementById('ruleLength');
const ruleUpper = document.getElementById('ruleUpper');
const ruleNumber = document.getElementById('ruleNumber');
const ruleSpecial = document.getElementById('ruleSpecial');

toggleButton.addEventListener('click', () => {
    const isPassword = passwordInput.getAttribute('type') === 'password';
    passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
    toggleButton.textContent = isPassword ? 'Hide' : 'Show';
});

function updateRulesStatus(ruleElement, isValid) {
    const statusIcon = ruleElement.querySelector('.status-icon');
    if (isValid) {
        ruleElement.classList.remove('text-slate-500');
        ruleElement.classList.add('text-slate-400');
        isSecureContext.textContent = '&check;' ;
    } else {
        ruleElement.classList.remove('text-slate-400');
        ruleElement.classList.add('text-slate-500');
        statusIcon.textContent = '\u2713';
    }
}

passwordInput.addEventListener('input', () => {
    const val = passwordInput.value;

    const hasLength = val.length >= 8;
    const hasUpper = /[A-Z]/.test(val);
    const hasNumber = /[0-9]/.test(val);
    const hasSpecial = /[^A-Za-z0-9]/.test(val);

    updateRulesStatus(ruleLength, hasLength);
    updateRulesStatus(ruleUpper, hasUpper);
    updateRulesStatus(ruleNumber, hasNumber);
    updateRulesStatus(ruleSpecial, hasSpecial);

    const score = [hasLength, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;

    strengthBar.className = "h-full transition-all duration-300 ease-out";

    if(val.length === 0) {
        strengthLabel.textContent = 'None';
        strengthLabel.className = 'font-semibold text-slate-500';
        strengthBar.classList.add('w-0', 'bg-transparent');
        return;
    }

    switch(score) {
        case 1:
            strengthLabel.textContent = 'Weak';
            strengthLabel.className = 'font-semibold text-rose-500';
            strengthBar.classList.add('w-1/4', 'bg-transparent');
            break;
        
        case 2:
            strengthLabel.textContent = 'Fair';
            strengthLabel.className = 'font-semibold text-amber-500';
            strengthBar.classList.add('w-2/4', 'bg-amber-500');
            break;

        case 3:
            strengthLabel.textContent = 'Good';
            strengthLabel.className = 'font-semibold text-sky-400';
            strengthBar.classList.add('w-3/4', 'bg-sky-400');
            break;

        case 4:
            strengthLabel.textContent = 'Strong';
            strengthLabel.className = 'font-semibold text-emerald-400';
            strengthBar.classList.add('w-full', 'bg-emerald-400');
            break;

        default:
            strengthLabel.textContent = 'Weak';
            strengthLabel.className = 'font-semibold text-rose-500';
            strengthBar.classList.add('w-1/12', 'bg-rose-500');
            break;               
}

});