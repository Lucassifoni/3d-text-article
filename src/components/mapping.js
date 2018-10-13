import Manual from './parts/Manual';
import Programmatically from './parts/Programmatically';

export default {
  title: 'Creating 3d printable dies for a typographic press',
  description: 'A research log to attain lead-like precision and features.',
  parts: [
    {
      title: 'Trying to manually reproduce movable type.',
      description: 'Chamfers, resolution, problems.',
      component: Manual,
    },
    {
      title: 'Trying to programmatically generate 3D models.',
      description: 'And writing a svg renderer in the meantime.',
      component: Programmatically,
    },
  ],
};