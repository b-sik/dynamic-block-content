import {
  SelectControl,
  PanelBody,
  PanelRow,
  ToggleControl,
  ToolbarButton,
  ToolbarGroup,
} from '@wordpress/components';
import { BlockControls, InspectorControls } from '@wordpress/block-editor';

import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useSelect, dispatch } from '@wordpress/data';
import { ALLOWED_BLOCKS } from '../../constants.json';
import { ALLOWED_BLOCKS_SETTINGS } from '../config';

const PostMetaControls = () => {
  /**
   * Meta global.
   */
  const { postMeta } = dynamicContent;

  /**
   * If no post meta.
   */
  if (0 === postMeta.length) {
    return (
      <PanelBody
        title={__('Dynamic Content', 'bszyk-plugins-dc')}
        initialOpen={true}
      >
        <PanelRow>
          <p>{__('No post meta found!', 'bszyk-plugins-dc')}</p>
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
   * Update selected block's dynamic content attribute.
   * @param {Object} block Selected block.
   * @param {string} key Content.
   * @param {string} value Value.
   * @returns {void}
   */
  const updateDynamicContent = (block, key, value) => {
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
   * Clear dynamic content from selected block.
   * @param {Object} block Selected block.
   * @returns {void}
   */
  const removeDynamicContent = (block) => {
    updateDynamicContent(block, 'delete', 'delete');
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

  /**
   * Check if block has a dynamic content attribute with a value.
   * @param {Object} block Block.
   * @returns
   */
  const isDynamicContentBlock = (block) => {
    if (null === block || !ALLOWED_BLOCKS.includes(block.name)) {
      return null;
    }

    const { attributes } = block;

    if (
      'undefined' === typeof attributes['dc_metakey'] ||
      null === attributes['dc_metakey'] ||
      '' === attributes['dc_metakey']
    ) {
      return false;
    } else if (
      'string' === typeof attributes['dc_metakey'] &&
      attributes['dc_metakey'].length > 0
    ) {
      return true;
    }
  };

  /**
   * Toggle control.
   */
  const [hasDynamicContent, setHasDynamicContent] = useState(null);

  /**
   *
   */
  useEffect(() => {
    setHasDynamicContent(isDynamicContentBlock(selectedBlock));
  }, []);

  useEffect(() => {
    if (null === hasDynamicContent) {
      return;
    }

    hasDynamicContent
      ? updateDynamicContent(
          selectedBlock,
          selectedPostMetaKey,
          selectedPostMetaValue
        )
      : removeDynamicContent(selectedBlock);
  }, [hasDynamicContent, selectedPostMetaKey, selectedPostMetaValue]);

  return (
    <>
      <ToolbarGroup>
        <ToolbarButton
          icon='database'
          label={__('Toggle Dynamic Content', 'bszyk-plugins-dc')}
          onClick={() => setHasDynamicContent(!hasDynamicContent)}
        />
      </ToolbarGroup>
      <InspectorControls>
        <PanelBody
          title={__('Dynamic Content', 'bszyk-plugins-dc')}
          initialOpen={hasDynamicContent}
        >
          <PanelRow>
            <ToggleControl
              label={__('Toggle Dynamic Content on/off', 'bszyk-plugins-dc')}
              help={
                hasDynamicContent
                  ? __('Dynamic Content enabled.', 'bszyk-plugins-dc')
                  : __('Dynamic Content disabled.', 'bszyk-plugins-dc')
              }
              checked={hasDynamicContent}
              onChange={() => {
                setHasDynamicContent(!hasDynamicContent);
              }}
            />
          </PanelRow>
          {hasDynamicContent && (
            <>
              <PanelRow>
                <SelectControl
                  label={__('Select post meta key:', 'bszyk-plugins-dc')}
                  value={
                    selectedPostMetaKey
                      ? selectedPostMetaKey
                      : __('No post meta found!', 'bszyk-plugins-dc')
                  }
                  onChange={(key) => setPostMetaKey(key)}
                  options={postMetaKeyOptions()}
                  disabled={!ALLOWED_BLOCKS.includes(selectedBlock.name)}
                />
              </PanelRow>
              <PanelRow>
                <SelectControl
                  label={__('Select value:', 'bszyk-plugins-dc')}
                  value={selectedPostMetaValue}
                  onChange={(value) => setPostMetaValue(value)}
                  options={postMetaValueOptions()}
                  disabled={!ALLOWED_BLOCKS.includes(selectedBlock.name)}
                />
              </PanelRow>
            </>
          )}
        </PanelBody>
      </InspectorControls>
    </>
  );
};

export default PostMetaControls;
