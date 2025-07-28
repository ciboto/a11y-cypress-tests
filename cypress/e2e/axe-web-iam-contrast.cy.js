describe('Acessibilidade no WebAIM Contrast Checker', () => {
  beforeEach(() => {
    cy.visit('https://webaim.org/resources/contrastchecker/');
    cy.injectAxe();
  });

  it('Logo deve estar visível e acessível', () => {
    cy.get('img[alt="WebAIM - Web Accessibility In Mind"]')
      .should('be.visible')
      .and('have.attr', 'src')
      .and('include', 'logo');
  });

  it('Página deve passar sem violações críticas ou sérias', () => {
    cy.checkA11y(
      null,
      {
        runOnly: {
          type: 'tag',
          values: ['wcag2aa', 'wcag21aa'],
        },
        includedImpacts: ['critical', 'serious'],
      },
      (violations) => {
        if (violations.length) {
          const messages = violations.map(
            (v) => `${v.id}: ${v.help} (${v.nodes.length} elementos)`
          ).join('\n');
          assert.fail(`Foram detectadas ${violations.length} violações:\n${messages}`);
        }
      }
    );
  });

  it('HTML deve ter atributo lang definido', () => {
    cy.document()
      .its('documentElement')
      .should('have.attr', 'lang')
      .and('match', /^[a-z]{2}(-[A-Z]{2})?$/); // exemplo: en ou en-US
  });

  it('Campos devem ser acessíveis via teclado (Tab)', () => {
    const idsEsperados = [
      'Hex1',  // Foreground hex input
      'Pic1',  // Foreground color picker
      'Alpha1',// Foreground alpha
      'Lig1',  // Foreground lightness
      'Hex0',  // Background hex input
      'Pic0',  // Background color picker
      'Lig0'   // Background lightness
    ];

    cy.get(`#${idsEsperados[0]}`).focus().should('have.focus');

    idsEsperados.slice(1).forEach((idEsperado) => {
      cy.focused().tab();
      cy.focused().should('have.attr', 'id', idEsperado);
    });
  });
});
