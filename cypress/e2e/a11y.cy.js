describe('Acessibilidade - Suite de Testes com Cypress + axe-core', () => {

    beforeEach(() => {
        cy.on('uncaught:exception', (err, runnable) => {
            // Ignora erros de JS de terceiros que não impactam o teste de acessibilidade
            return false;
        });
    });

    it('WebAIM Contrast Checker - detecta problemas de contraste', () => {
        cy.visit('https://webaim.org/resources/contrastchecker/');
        cy.injectAxe();
        cy.checkA11y(null, {}, (violations) => {
            if (violations.length) {
                const messages = violations.map(v => `${v.id}: ${v.help} (${v.nodes.length} elementos)`).join('\n');
                assert.fail(`Foram detectadas ${violations.length} violações:\n${messages}`);
            }
        });
    });

});
