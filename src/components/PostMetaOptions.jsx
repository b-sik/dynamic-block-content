import {
  Button,
  SelectControl,
  PanelBody,
  PanelRow,
} from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useSelect, dispatch } from '@wordpress/data';
import { ALLOWED_BLOCKS } from '../../constants.json';
import { ALLOWED_BLOCKS_SETTINGS } from '../config';

const PostMetaOptions = () => {
  /**
   * Meta global.
   */
  const { postMeta } = dynamicContent;

  if (0 === postMeta.length) {
    return (
      <PanelBody title='Post Meta Options' initialOpen={true}>
        <PanelRow>
          <p>{__('No post meta found!', 'ea-plugins')}</p>
        </PanelRow>
      </PanelBody>
    );
  }

  /**
   * Get the currently selected block.
   */
  const selectedBlock = useSelect((select) =>
    select('core/block-editor').getSelectedBlock()
  );

  /**
   * Create options for post meta keys.
   * @returns {Array<Object>}
   */
  const postMetaKeyOptions = () => {
    let options = [];

    Object.keys(postMeta).forEach((key) => {
      options.push({ value: key, label: key });
    });

    return options;
  };

  /**
   * Set selected post meta key state.
   */
  const [selectedPostMetaKey, setPostMetaKey] = useState(
    postMetaKeyOptions().length > 0 ? postMetaKeyOptions()[0].value : null
  );

  /**
   * Create options for post meta values.
   * @returns {Array<Object>}
   */
  const postMetaValueOptions = () => {
    let options = [];

    postMeta[selectedPostMetaKey].forEach((value) => {
      options.push({ value: value, label: value });
    });

    return options;
  };

  /**
   * Set selected post meta value state.
   */
  const [selectedPostMetaValue, setPostMetaValue] = useState(
    postMetaValueOptions().length > 0 ? postMetaValueOptions()[0].value : null
  );

  /**
   * Keep meta value current.
   */
  useEffect(() => {
    setPostMetaValue(postMeta[selectedPostMetaKey][0]);
  }, [selectedPostMetaKey]);

  /**
   * Update selected block's relevant attributes.
   * @param {Object} block Selected block.
   * @param {string} key Content.
   * @param {string} value Value.
   */
  const updateSelectedBlock = (block, key, value) => {
    if (null === block || !ALLOWED_BLOCKS.includes(block.name)) {
      return;
    }

    const { contentAttKey } = ALLOWED_BLOCKS_SETTINGS[block.name];

    if ('delete' === key && 'delete' === value) {
      dispatch('core/block-editor').updateBlockAttributes(block.clientId, {
        [contentAttKey]: '',
        dc_metakey: '',
      });
    } else {
      dispatch('core/block-editor').updateBlockAttributes(block.clientId, {
        [contentAttKey]: value,
        dc_metakey: key,
      });
    }
  };

  /**
   * Set the correct metakey in the inspector controls.
   */
  useEffect(() => {
    if (
      null === selectedBlock ||
      !ALLOWED_BLOCKS.includes(selectedBlock.name)
    ) {
      return;
    }

    const { attributes } = selectedBlock;

    if (
      'undefined' === typeof attributes['dc_metakey'] ||
      null === attributes['dc_metakey'] ||
      '' === attributes['dc_metakey']
    ) {
      return;
    }

    const metaKey = attributes['dc_metakey'];

    setPostMetaKey(metaKey);
  }, [selectedBlock]);

  return (
    <PanelBody title='Post Meta Options' initialOpen={true}>
      {selectedBlock ? (
        <>
          <PanelRow>
            <SelectControl
              label={__('Select post meta key:', 'ea-plugins')}
              value={
                selectedPostMetaKey
                  ? selectedPostMetaKey
                  : __('No post meta found!', 'ea-plugins')
              }
              onChange={(key) => setPostMetaKey(key)}
              options={postMetaKeyOptions()}
              disabled={!ALLOWED_BLOCKS.includes(selectedBlock.name)}
            />
          </PanelRow>
          {selectedPostMetaKey && (
            <PanelRow>
              <SelectControl
                label={__('Select value:', 'ea-plugins')}
                value={selectedPostMetaValue}
                onChange={(value) => setPostMetaValue(value)}
                options={postMetaValueOptions()}
                disabled={!ALLOWED_BLOCKS.includes(selectedBlock.name)}
              />
            </PanelRow>
          )}

          <PanelRow>
            <Button
              isSecondary
              onClick={() =>
                updateSelectedBlock(
                  selectedBlock,
                  selectedPostMetaKey,
                  selectedPostMetaValue
                )
              }
              disabled={!ALLOWED_BLOCKS.includes(selectedBlock.name)}
            >
              {selectedBlock
                ? `Update ${selectedBlock.name} block`
                : 'No block selected'}
            </Button>
          </PanelRow>
          <PanelRow>
            <Button
              isDestructive
              onClick={() =>
                updateSelectedBlock(selectedBlock, 'delete', 'delete')
              }
              disabled={!ALLOWED_BLOCKS.includes(selectedBlock.name)}
            >
              {__('Remove Dynamic Content')}
            </Button>
          </PanelRow>
        </>
      ) : (
        <PanelRow>{__('Please select a block', 'ea-plugins')}</PanelRow>
      )}
    </PanelBody>
  );
};

export default PostMetaOptions;
