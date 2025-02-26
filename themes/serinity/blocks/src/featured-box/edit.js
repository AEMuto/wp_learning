import { __ } from '@wordpress/i18n';
import {
  RichText,
  InspectorControls,
  useBlockProps
} from '@wordpress/block-editor';
import {
  PanelBody,
  ColorPicker
} from '@wordpress/components';

function Edit({ attributes, setAttributes }) {
  const { title, content, backgroundColor } = attributes;
  const blockProps = useBlockProps({
    style: { backgroundColor },
  });

  return (
    <>
      <InspectorControls>
        <PanelBody title={__('Box Settings', 'serinity')}>
          <ColorPicker
            label={__('Background Color', 'serinity')}
            value={backgroundColor}
            onChange={(value) => setAttributes({ backgroundColor: value })}
          />
        </PanelBody>
      </InspectorControls>

      <div {...blockProps}>
        <RichText
          tagName="h3"
          className="featured-box-title"
          value={title}
          onChange={(title) => setAttributes({ title })}
          placeholder={__('Box Title', 'serinity')}
        />
        <RichText
          tagName="div"
          className="featured-box-content"
          value={content}
          onChange={(content) => setAttributes({ content })}
          placeholder={__('Box Content', 'serinity')}
        />
      </div>
    </>
  );
}

export default Edit;