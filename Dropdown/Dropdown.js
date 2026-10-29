const faqButtons = document.querySelectorAll('.faq-btn');

faqButtons.forEach((btn) => {
    btn.addEventListener('click', (e) =>{
        const currentBtn = e.currentTarget;
        const currentItem = currentBtn.closest('.faq-item');
        const currentAnswer = currentItem.querySelector('.faq-answer');
        const currentChevron = currentItem.querySelector('.chevron');
        const currentTitle = currentBtn.querySelector('span');

        const isOpen = currentAnswer.classList.contains('grid-rows-[1fr]');

        faqButtons.forEach((otherBtn) => {
            const otherItem = otherBtn.closest('.faq-item');
            const otherAnswer = otherItem.querySelector('.faq-answer');
            const otherChevron = otherItem.querySelector('.chevron');
            const otherTitle = otherBtn.querySelector('span');

            otherAnswer.classList.remove('grid-rows-[1fr]');
            otherAnswer.classList.add('grid-rows-[0fr]');
            otherChevron.classList.remove('rotate-180', 'text-indigo-400');
            otherTitle.classList.remove('text-indigo-400');
            otherItem.classList.remove('border-indigo-500/40', 'bg-slate-900');
        });

        if(!isOpen) {
            currentAnswer.classList.remove('grid-rows-[0fr]');
            currentAnswer.classList.add('grid-rows-[1fr]');
            currentChevron.classList.add('rotate-180', 'text-indigo-400');
            currentTitle.classList.add('text-indigo-400');
            currentItem.classList.add('border-indigo-500/40', 'bg-slate-900');
        }
    });
});