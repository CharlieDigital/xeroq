import './style.css'
import { renderCapture } from './render-capture';
import { renderInitiator } from './render-initiator';

const params = new URLSearchParams(window.location.search)

if (params.has("sessionId")) {
  renderCapture();
} else {
  renderInitiator();
}
