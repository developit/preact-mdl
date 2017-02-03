import { h, render, Component } from 'preact';
import assertJsx from 'preact-jsx-chai';
chai.use(assertJsx);
import { Button, TextField } from '..';

/*eslint-env browser,mocha*/
/*global sinon,expect,chai*/

describe('preact-mdl', () => {
	let scratch;

	before( () => {
		scratch = document.createElement('div');
		(document.body || document.documentElement).appendChild(scratch);
	});

	beforeEach( () => {
		scratch.innerHTML = '';
	});

	after( () => {
		scratch.parentNode.removeChild(scratch);
		scratch = null;
	});

	describe('<Button />', () => {
		it('should render a button', () => {
			expect(
				<Button>Text</Button>
			).to.eql(
				<button class="mdl-button mdl-js-ripple-effect mdl-js-button">
					Text
				</button>
			);
		});
	});

	describe('<TextField />', () => {
		it('should add the custom class', () => {
			let field = <TextField class="custom_class"/>;
			expect(field).to.contain('custom_class');
		});

		it('should display an errorMessage if exists', () => {
			let field = <TextField errorMessage="error message" />;
			expect(field).to.contain('error message');
			expect(field).to.contain('is-invalid');
		});

		it('should display an errorMessage with custom class', () => {
			let field = <TextField errorMessage="error message" class="custom_class"/>;
			expect(field).to.contain('error message');
			expect(field).to.contain('is-invalid');
			expect(field).to.contain('custom_class');
		});
	});
});
