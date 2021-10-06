import { registerPlugin } from '@wordpress/plugins';
import DynamicContentPlugin from '../components/index.jsx'

registerPlugin('bsik-dynamic-content', {
  icon: 'database',
  render: () => <DynamicContentPlugin />
});
