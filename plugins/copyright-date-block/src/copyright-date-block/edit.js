/**
 * __ (double underscore) is a function that retrieves the translation of text.
 * useBlockProps: React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 * InspectorControls: A slot for the block inspector controls.
 * PanelBody: A container for a set of controls.
 * TextControl: A text input field.
 * './editor.scss': Importing the editor styles. Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
	const { startingYear } = attributes;
	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Settings', 'copyright-date-block')}>
					<TextControl
						label={__('Starting Year', 'copyright-date-block')}
						value={startingYear}
						onChange={(startingYear) => setAttributes({ startingYear })}
					/>
				</PanelBody>
			</InspectorControls>
			<p {...useBlockProps()}>
				{__(
					'Copyright',
					'copyright-date-block'
				)} &copy; {startingYear} - {new Date().getFullYear()}
			</p>
		</>
	);
}
