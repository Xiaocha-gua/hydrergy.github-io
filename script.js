document.addEventListener('DOMContentLoaded', function() {
    // 仅保留电解二氧化碳和咨询业务的点击展开逻辑
    const learnMoreButtons = document.querySelectorAll('.service-section .learn-more-link');

    learnMoreButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const detailsContent = document.getElementById(targetId);

            if (detailsContent) {
                detailsContent.classList.toggle('active');
                if (detailsContent.classList.contains('active')) {
                    this.textContent = '收起';
                } else {
                    this.textContent = '了解更多';
                }
            }
        });
    });
});