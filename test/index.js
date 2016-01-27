import { h, render, Component } from 'preact';
import assertJsx from 'preact-jsx-chai';
chai.use(assertJsx);
import { Button } from '..';

/*eslint-env browser,mocha*/
/*global sinon,expect,chai*/

describe('Markup', () => {
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
});
