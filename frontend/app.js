const form = document.getElementById('portfolio-form');
const statusEl = document.getElementById('status');
const previewFrame = document.getElementById('preview');
const downloadBtn = document.getElementById('download-btn');

const projectsWrap = document.getElementById('projects');
const experienceWrap = document.getElementById('experience');
const educationWrap = document.getElementById('education');

let currentGenerationId = null;

function addItem(container, templateId) {
  const template = document.getElementById(templateId);
  container.appendChild(template.content.cloneNode(true));
}

function collectItems(container) {
  return [...container.querySelectorAll('.item')].map((item) => {
    const obj = {};
    item.querySelectorAll('[data-field]').forEach((el) => {
      const raw = el.value.trim();
      if (el.dataset.field === 'techStack') {
        obj[el.dataset.field] = raw ? raw.split(',').map((s) => s.trim()).filter(Boolean) : [];
      } else {
        obj[el.dataset.field] = raw;
      }
    });
    return obj;
  });
}

document.getElementById('add-project').addEventListener('click', () => addItem(projectsWrap, 'project-template'));
document.getElementById('add-experience').addEventListener('click', () => addItem(experienceWrap, 'experience-template'));
document.getElementById('add-education').addEventListener('click', () => addItem(educationWrap, 'education-template'));

addItem(projectsWrap, 'project-template');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  statusEl.textContent = 'Generating portfolio project...';
  downloadBtn.disabled = true;

  const formData = new FormData(form);
  const payload = {
    name: formData.get('name').trim(),
    title: formData.get('title').trim(),
    bio: formData.get('bio').trim(),
    skills: formData.get('skills').split(',').map((s) => s.trim()).filter(Boolean),
    projects: collectItems(projectsWrap),
    experience: collectItems(experienceWrap),
    education: collectItems(educationWrap),
    contact: {
      email: formData.get('email').trim(),
      phone: formData.get('phone').trim(),
      location: formData.get('location').trim(),
      linkedin: formData.get('linkedin').trim(),
      github: formData.get('github').trim()
    },
    designStyle: formData.get('designStyle'),
    framework: formData.get('framework')
  };

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Generation failed');
    }

    currentGenerationId = data.generationId;
    previewFrame.srcdoc = data.previewHtml;
    downloadBtn.disabled = false;
    statusEl.textContent = `Generated ${data.files.length} files successfully.`;
  } catch (error) {
    statusEl.textContent = error.message;
  }
});

downloadBtn.addEventListener('click', () => {
  if (!currentGenerationId) {
    return;
  }
  window.location.href = `/api/generate/${currentGenerationId}/download`;
});
