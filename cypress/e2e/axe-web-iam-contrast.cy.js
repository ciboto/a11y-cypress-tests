describe('Acessibilidade no WebAIM Contrast Checker', () => {
  beforeEach(() => {
    cy.on('uncaught:exception', () => false);
    cy.visit('https://webaim.org/resources/contrastchecker/');
    cy.injectAxe();
  });

  it('Imagem do logo deve estar visível e acessível', () => {
    cy.get('img[alt="WebAIM - Web Accessibility In Mind"]')
      .should('be.visible')
      .and(($img) => {
        // Confirma que largura e altura estão corretas
        expect($img[0].naturalWidth).to.be.greaterThan(0);
        expect($img[0].naturalHeight).to.be.greaterThan(0);
        expect($img).to.have.attr('width', '315');
        expect($img).to.have.attr('height', '83');
      });
    
    // Testa regras de acessibilidade específicas para a imagem
    cy.checkA11y('img[alt="WebAIM - Web Accessibility In Mind"]', {
      includedImpacts: ['critical', 'serious']
    }, (violations) => {
      if (violations.length) {
        const messages = violations.map(v => `${v.id}: ${v.help} (${v.nodes.length} elementos)`).join('\n');
        assert.fail(`Violação na imagem do logo:\n${messages}`);
      }
    });
  });

  it('Página deve passar sem violações críticas ou sérias', () => {
    cy.checkA11y(null, {
      includedImpacts: ['critical', 'serious']
    }, (violations) => {
      if (violations.length) {
        const messages = violations.map(v => `${v.id}: ${v.help} (${v.nodes.length} elementos)`).join('\n');
        assert.fail(`Foram detectadas ${violations.length} violações:\n${messages}`);
      }
    });
  });
});
