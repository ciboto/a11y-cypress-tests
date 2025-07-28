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
      cy.log(`🔎 Encontradas ${violations.length} violações`);
      expect(violations.length).to.eq(0);
    });
  });

  it('Gov.uk Design System - componente de botões', () => {
    cy.visit('https://design-system.service.gov.uk/components/button/');
    cy.injectAxe();
    cy.checkA11y(null, {}, (violations) => {
      cy.log(`🔎 Encontradas ${violations.length} violações`);
      expect(violations.length).to.eq(0);
    });
  });

  it('WAI ARIA - exemplo de tabs acessíveis', () => {
    cy.visit('https://www.w3.org/WAI/ARIA/apg/patterns/tabs/');
    cy.injectAxe();
    cy.checkA11y(null, {}, (violations) => {
      cy.log(`🔎 Encontradas ${violations.length} violações`);
      expect(violations.length).to.eq(0);
    });
  });

});
