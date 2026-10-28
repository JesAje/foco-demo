// Funciones locales adicionales para la demo Foco.
const focoQuestions = {
  'Cálculo I': [
    { prompt: 'Si f(x) = x² + 3x, ¿cuál es f′(x)?', answers: ['2x + 3', 'x + 3', '2x² + 3', 'x² + 3'], correct: 0, explanation: 'La derivada de x² es 2x y la de 3x es 3.' },
    { prompt: '¿Cuál es el límite de (x² − 1)/(x − 1) cuando x tiende a 1?', answers: ['0', '1', '2', 'No existe'], correct: 2, explanation: 'Al factorizar y simplificar queda x + 1, cuyo límite es 2.' },
    { prompt: '¿Cuál es una antiderivada de 2x?', answers: ['x² + C', '2x² + C', 'x + C', 'x²'], correct: 0, explanation: 'Una antiderivada de 2x es x² + C.' },
  ],
  'Álgebra Lineal': [
    { prompt: 'Calcula el determinante de [[1, 2], [3, 4]].', answers: ['−2', '2', '6', '0'], correct: 0, explanation: 'Para una matriz 2×2: 1×4 − 2×3 = −2.' },
    { prompt: '¿Cuál es el vector cero en R²?', answers: ['(1, 1)', '(0, 0)', '(0, 1)', '(1, 0)'], correct: 1, explanation: 'El vector cero tiene todas sus componentes iguales a cero.' },
    { prompt: 'Si A es la matriz identidad, ¿qué ocurre con Ax?', answers: ['Da el vector cero', 'Cambia el orden', 'Es igual a x', 'No se puede calcular'], correct: 2, explanation: 'La matriz identidad conserva cualquier vector: Ix = x.' },
  ],
  'Física Mecánica': [
    { prompt: 'Una fuerza paralela de 10 N desplaza un objeto 3 m. ¿Qué trabajo realiza?', answers: ['13 J', '30 J', '7 J', '3 J'], correct: 1, explanation: 'El trabajo es fuerza por desplazamiento: 10 × 3 = 30 J.' },
    { prompt: '¿Cuál es la unidad de fuerza en el SI?', answers: ['Joule', 'Watt', 'Newton', 'Pascal'], correct: 2, explanation: 'La fuerza se mide en newtons (N).' },
    { prompt: 'Si la velocidad se duplica, ¿qué pasa con la energía cinética?', answers: ['Se duplica', 'Se cuadruplica', 'No cambia', 'Se reduce a la mitad'], correct: 1, explanation: 'La energía cinética depende de v²; al duplicar v, se multiplica por cuatro.' },
  ],
  Programación: [
    { prompt: '¿Qué imprime `if (3 > 2) print("Sí");`?', answers: ['No', 'Sí', '3 > 2', 'Nada'], correct: 1, explanation: 'La condición 3 > 2 es verdadera, por eso se muestra “Sí”.' },
    { prompt: '¿Para qué sirve una función?', answers: ['Repetir una tarea reutilizable', 'Apagar el programa', 'Cambiar el teclado', 'Guardar imágenes'], correct: 0, explanation: 'Una función agrupa instrucciones para usarlas cuando se necesiten.' },
    { prompt: '¿Cuál índice suele tener el primer elemento de una lista?', answers: ['1', '−1', '0', '10'], correct: 2, explanation: 'En muchos lenguajes, las listas comienzan en el índice 0.' },
  ],
};

const extraStyle = document.createElement('style');
extraStyle.textContent = `
  .extra-button{border:1px solid #e8eeeb;background:#fff;color:#176c55;padding:8px 11px;border-radius:10px;font-size:11px;font-weight:700;cursor:pointer}
  .extra-actions{display:flex;gap:6px;margin-left:auto}.block-action{border:1px solid #e8eeeb;background:#fff;border-radius:9px;width:30px;height:30px;color:#176c55;cursor:pointer}.block-action.delete{color:#176c55}
  .planrow.is-done{opacity:.64}.planrow.is-done strong{text-decoration:line-through}.extra-dialog{width:min(520px,calc(100% - 28px));border:0;border-radius:21px;padding:24px;color:#172b2a;box-shadow:0 24px 80px #132b2638}.extra-dialog::backdrop{background:#11252180;backdrop-filter:blur(3px)}.extra-dialog h2{font:800 24px Manrope,sans-serif;letter-spacing:-.6px;margin:9px 0 16px}.extra-dialog label{display:grid;gap:6px;color:#71817d;font-size:11px;font-weight:600;margin:11px 0}.extra-dialog input,.extra-dialog select{width:100%;border:1px solid #e8eeeb;border-radius:10px;padding:11px;font:inherit;color:#172b2a;background:white}.extra-primary{border:0;border-radius:10px;background:#176c55;color:#fff;padding:11px 14px;font-weight:700;cursor:pointer}.extra-close{float:right;border:0;border-radius:9px;background:#e8f6ef;color:#172b2a;width:32px;height:32px;font-size:21px;cursor:pointer}.survey-checks{display:grid;grid-template-columns:1fr 1fr;gap:5px 12px}.survey-checks label{display:flex;align-items:center;gap:7px;margin:4px 0;font-weight:500}.survey-checks input{width:auto}.extra-answer-list{display:grid;gap:8px}.extra-answer{padding:12px;border:1px solid #e8eeeb;border-radius:11px;background:#fff;color:#172b2a;text-align:left;cursor:pointer}.extra-answer.selected{border-color:#176c55;background:#e8f6ef}.extra-answer.correct{background:#e8f6ef;border-color:#176c55}.extra-answer.wrong{background:#fff2e9;border-color:#ef9b4e}.extra-feedback{padding:12px;border-radius:11px;background:#e8f6ef;font-size:12px;line-height:1.5}.timer-display{font:800 52px Manrope;text-align:center;margin:22px 0;color:#176c55}.coupon-box{background:#fff9f1;border:1px solid #f4e8d7;border-radius:15px;padding:16px;margin-top:15px}.coupon-code{font-weight:800;letter-spacing:1px;color:#176c55}.extra-toast{position:fixed;z-index:20;left:50%;bottom:88px;transform:translate(-50%,16px);opacity:0;transition:.2s;background:#172b2a;color:#fff;padding:11px 16px;border-radius:12px;font-size:12px;pointer-events:none}.extra-toast.visible{opacity:1;transform:translate(-50%,0)}
`;
document.head.appendChild(extraStyle);

document.body.insertAdjacentHTML('beforeend', `
  <dialog id="profileDialog" class="extra-dialog"><form id="profileForm"><button class="extra-close" type="button" data-extra-close="profileDialog">×</button><span class="eyebrow">TU PERFIL DE ESTUDIO</span><h2>¿Cómo te podemos acompañar?</h2><label>Carrera<input name="career" maxlength="80" placeholder="Ej. Ingeniería Civil"></label><label>Semestre<select name="semester"><option>1er semestre</option><option>2do semestre</option><option>3er semestre</option><option>4to semestre</option><option>5to semestre</option><option>6to semestre</option><option>Otro</option></select></label><div>¿Qué te cuesta más?</div><div class="survey-checks"><label><input type="checkbox" name="difficulty" value="Organizarme"> Organizarme</label><label><input type="checkbox" name="difficulty" value="Encontrar método"> Encontrar método</label><label><input type="checkbox" name="difficulty" value="Tolerar la frustración"> Tolerar la frustración</label><label><input type="checkbox" name="difficulty" value="Entender enunciados"> Entender enunciados</label><label><input type="checkbox" name="difficulty" value="Destrabar ejercicios"> Destrabar ejercicios</label><label><input type="checkbox" name="difficulty" value="Ser constante"> Ser constante</label></div><label>¿Cómo prefieres estudiar?<select name="study_style"><option>Con ejercicios</option><option>En equipo</option><option>Con resúmenes</option><option>En bloques breves</option><option>Una mezcla de métodos</option></select></label><button class="extra-primary" type="submit">Guardar mis respuestas</button></form></dialog>
  <dialog id="extraQuizDialog" class="extra-dialog"><div><button class="extra-close" type="button" data-extra-close="extraQuizDialog">×</button><span class="eyebrow" id="extraQuizSubject">PRÁCTICA</span><div id="extraQuizProgress" style="color:#71817d;font-size:10px;margin:8px 0">Pregunta 1 de 3</div><h2 id="extraQuizPrompt"></h2><div id="extraQuizAnswers" class="extra-answer-list"></div><p id="extraQuizFeedback" class="extra-feedback" hidden></p><button id="extraQuizCheck" class="extra-primary" type="button" disabled>Revisar respuesta</button><button id="extraQuizNext" class="extra-primary" type="button" hidden>Siguiente pregunta →</button></div></dialog>
  <dialog id="timerDialog" class="extra-dialog"><div><button class="extra-close" type="button" data-extra-close="timerDialog">×</button><span class="eyebrow">MÉTODO POMODORO</span><h2>Un bloque de concentración</h2><label>Duración<select id="timerMinutes"><option value="25">25 minutos · foco</option><option value="15">15 minutos · breve</option><option value="5">5 minutos · prueba rápida</option></select></label><div id="timerDisplay" class="timer-display">25:00</div><div style="display:flex;gap:9px"><button id="timerToggle" class="extra-primary" type="button">Empezar</button><button id="timerReset" class="extra-button" type="button">Reiniciar</button></div></div></dialog>
  <div id="extraToast" class="extra-toast"></div>
`);

function extraToast(message) {
  const toast = document.getElementById('extraToast');
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(extraToast.timer);
  extraToast.timer = setTimeout(() => toast.classList.remove('visible'), 2600);
}

function syncExtraState() {
  if (typeof baseRenderState === 'function') baseRenderState();
  const profile = state.profile || {};
  const profileDetail = document.querySelector('.profile small');
  if (profileDetail && profile.career) profileDetail.textContent = `${profile.career} · ${profile.semester || ''}`;
  const profileRows = document.querySelectorAll('#perfil .resource span.pill');
  if (profileRows.length >= 4) {
    profileRows[0].textContent = profile.career || 'Completar encuesta';
    profileRows[1].textContent = profile.semester || 'Sin indicar';
    profileRows[2].textContent = (profile.difficulties || []).join(' · ') || 'Aún sin respuestas';
    profileRows[3].textContent = profile.study_style || 'Sin indicar';
  }
  const rows = document.querySelectorAll('#agenda .weekplan .planrow');
  (state.blocks || []).forEach((block, index) => {
    const row = rows[index];
    if (!row) return;
    row.dataset.blockId = block.id;
    row.classList.toggle('is-done', Boolean(block.done));
    const badge = row.querySelectorAll('.pill')[1];
    if (badge) badge.textContent = block.done ? 'Completado' : 'Pendiente';
    let actions = row.querySelector('.extra-actions');
    if (!actions) {
      actions = document.createElement('div');
      actions.className = 'extra-actions';
      row.appendChild(actions);
    }
    actions.replaceChildren();
    const done = document.createElement('button');
    done.className = 'block-action'; done.type = 'button'; done.dataset.blockAction = 'toggle'; done.dataset.blockId = block.id; done.title = block.done ? 'Marcar pendiente' : 'Marcar completado'; done.textContent = block.done ? '↺' : '✓';
    const remove = document.createElement('button');
    remove.className = 'block-action delete'; remove.type = 'button'; remove.dataset.blockAction = 'delete'; remove.dataset.blockId = block.id; remove.title = 'Eliminar bloque'; remove.textContent = '×';
    actions.append(done, remove);
  });
  const coupon = document.getElementById('couponProgress');
  if (coupon) {
    const count = Number(state.exercises || 0);
    coupon.textContent = state.coupon_unlocked ? '¡Recompensa de muestra desbloqueada!' : `${Math.min(count, 50)} de 50 ejercicios completados`;
    const bar = document.getElementById('couponBar');
    if (bar) bar.style.width = `${Math.min(100, count * 2)}%`;
    const button = document.getElementById('couponButton');
    if (button) button.disabled = !state.coupon_unlocked;
  }
  const focus = document.getElementById('focusSummary');
  if (focus) focus.textContent = `${state.focus_minutes || 0} min · ${state.completed_sessions || 0} sesiones completadas`;
}

const baseRenderState = window.renderState;
if (typeof baseRenderState === 'function') {
  window.renderState = function () { syncExtraState(); };
}

document.querySelector('.hello .week')?.insertAdjacentHTML('afterend', '<button class="week" id="openProfile">Mi perfil ✎</button>');
document.getElementById('openProfile')?.addEventListener('click', () => {
  const profile = state.profile || {};
  const form = document.getElementById('profileForm');
  form.elements.career.value = profile.career || '';
  form.elements.semester.value = profile.semester || '1er semestre';
  form.elements.study_style.value = profile.study_style || 'Con ejercicios';
  form.querySelectorAll('[name="difficulty"]').forEach(input => input.checked = (profile.difficulties || []).includes(input.value));
  document.getElementById('profileDialog').showModal();
});
document.querySelector('#perfil .btn-light')?.addEventListener('click', () => document.getElementById('openProfile')?.click());
document.querySelector('#metodos .quiz button')?.addEventListener('click', () => document.getElementById('openProfile')?.click());
document.getElementById('profileForm').addEventListener('submit', async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const payload = { career: form.elements.career.value, semester: form.elements.semester.value, study_style: form.elements.study_style.value, difficulties: [...form.querySelectorAll('[name="difficulty"]:checked')].map(input => input.value) };
  try { state = await api('/api/profile', payload); document.getElementById('profileDialog').close(); syncExtraState(); extraToast('Perfil guardado en este computador.'); }
  catch (error) { extraToast(error.message); }
});

document.body.addEventListener('click', async event => {
  const close = event.target.closest('[data-extra-close]');
  if (close) document.getElementById(close.dataset.extraClose).close();
  const action = event.target.closest('[data-block-action]');
  if (action) {
    try { state = await api('/api/blocks/change', { id: action.dataset.blockId, action: action.dataset.blockAction }); syncExtraState(); extraToast(action.dataset.blockAction === 'delete' ? 'Bloque eliminado.' : 'Agenda actualizada.'); }
    catch (error) { extraToast(error.message); }
  }
});

// Atajos de simulacro por ramo. Captura el clic antes del modal de la demo base.
document.addEventListener('click', event => {
  const button = event.target.closest('#practica .courses .text-btn, #startQuiz');
  if (!button) return;
  event.preventDefault(); event.stopImmediatePropagation();
  const subject = button.id === 'startQuiz' ? 'Cálculo I' : button.closest('.course')?.querySelector('strong')?.textContent || 'Cálculo I';
  openExtraQuiz(subject);
}, true);

let extraSubject = 'Cálculo I', extraQuestionIndex = 0, extraChoice = null, extraAnswered = false;
function openExtraQuiz(subject) { extraSubject = focoQuestions[subject] ? subject : 'Cálculo I'; extraQuestionIndex = 0; drawExtraQuestion(); document.getElementById('extraQuizDialog').showModal(); }
function drawExtraQuestion() {
  const items = focoQuestions[extraSubject], item = items[extraQuestionIndex]; extraChoice = null; extraAnswered = false;
  document.getElementById('extraQuizSubject').textContent = 'SIMULACRO · ' + extraSubject.toUpperCase();
  document.getElementById('extraQuizProgress').textContent = `Pregunta ${extraQuestionIndex + 1} de ${items.length}`;
  document.getElementById('extraQuizPrompt').textContent = item.prompt;
  const list = document.getElementById('extraQuizAnswers'); list.replaceChildren();
  item.answers.forEach((answer, index) => { const button = document.createElement('button'); button.type = 'button'; button.className = 'extra-answer'; button.textContent = answer; button.addEventListener('click', () => { extraChoice = index; list.querySelectorAll('button').forEach(node => node.classList.remove('selected')); button.classList.add('selected'); document.getElementById('extraQuizCheck').disabled = false; }); list.appendChild(button); });
  document.getElementById('extraQuizFeedback').hidden = true; document.getElementById('extraQuizCheck').hidden = false; document.getElementById('extraQuizCheck').disabled = true; document.getElementById('extraQuizNext').hidden = true;
}
document.getElementById('extraQuizCheck').addEventListener('click', async () => {
  if (extraChoice === null || extraAnswered) return; extraAnswered = true;
  const items = focoQuestions[extraSubject], item = items[extraQuestionIndex], correct = extraChoice === item.correct;
  const feedback = document.getElementById('extraQuizFeedback'); feedback.hidden = false; feedback.textContent = (correct ? '¡Correcto! ' : 'Sigue practicando. ') + item.explanation;
  document.querySelectorAll('#extraQuizAnswers button').forEach((button, index) => { if (index === item.correct) button.classList.add('correct'); if (index === extraChoice && !correct) button.classList.add('wrong'); });
  document.getElementById('extraQuizCheck').hidden = true; document.getElementById('extraQuizNext').hidden = false;
  try { state = await api('/api/practice', { correct }); syncExtraState(); }
  catch (error) { extraToast(error.message); }
});
document.getElementById('extraQuizNext').addEventListener('click', () => { extraQuestionIndex = (extraQuestionIndex + 1) % focoQuestions[extraSubject].length; drawExtraQuestion(); });

document.querySelector('#inicio .tip')?.insertAdjacentHTML('beforeend', '<button class="extra-button" id="startPomodoro" style="margin-top:10px">Iniciar bloque de foco · 25 min</button><div id="focusSummary" style="margin-top:8px;font-size:10px;color:#71817d"></div>');
document.querySelectorAll('#metodos .study-cards button').forEach(button => { button.addEventListener('click', event => { if (button.textContent.includes('Probar método')) { event.stopImmediatePropagation(); document.getElementById('timerDialog').showModal(); } }, true); });
document.getElementById('startPomodoro')?.addEventListener('click', () => document.getElementById('timerDialog').showModal());
let remainingSeconds = 25 * 60, timerHandle = null;
const timerSelect = document.getElementById('timerMinutes'), timerDisplay = document.getElementById('timerDisplay'), timerToggle = document.getElementById('timerToggle');
function paintTimer() { timerDisplay.textContent = `${String(Math.floor(remainingSeconds / 60)).padStart(2, '0')}:${String(remainingSeconds % 60).padStart(2, '0')}`; }
timerSelect.addEventListener('change', () => { if (timerHandle) return; remainingSeconds = Number(timerSelect.value) * 60; paintTimer(); });
document.getElementById('timerReset').addEventListener('click', () => { clearInterval(timerHandle); timerHandle = null; timerToggle.disabled = false; timerToggle.textContent = 'Empezar'; remainingSeconds = Number(timerSelect.value) * 60; paintTimer(); });
timerToggle.addEventListener('click', () => {
  if (timerHandle) { clearInterval(timerHandle); timerHandle = null; timerToggle.textContent = 'Continuar'; return; }
  timerToggle.textContent = 'Pausar'; timerHandle = setInterval(async () => {
    remainingSeconds--; paintTimer();
    if (remainingSeconds <= 0) { clearInterval(timerHandle); timerHandle = null; timerToggle.textContent = 'Terminado'; timerToggle.disabled = true; try { state = await api('/api/focus', { minutes: Number(timerSelect.value) }); syncExtraState(); extraToast('¡Bloque completado! Sumaste 5 puntos.'); } catch (error) { extraToast(error.message); } }
  }, 1000);
});

document.querySelector('#practica .secondary-head')?.insertAdjacentHTML('afterend', '<div class="coupon-box"><strong>Meta de constancia · recompensa de muestra</strong><div id="couponProgress" style="font-size:11px;color:#71817d;margin:5px 0">28 de 50 ejercicios completados</div><div style="height:6px;background:#f4e1d1;border-radius:8px;overflow:hidden"><div id="couponBar" style="height:100%;width:56%;background:#ef9b4e"></div></div><button id="couponButton" class="extra-button" style="margin-top:10px" disabled>Desbloquear cupón demo</button><div style="font-size:9px;color:#85776a;margin-top:5px">Recompensa ilustrativa; no es un cupón real de la universidad.</div></div>');
document.getElementById('couponButton').addEventListener('click', () => alert('¡Meta alcanzada! Código de muestra: FOCO-ESTUDIO. No es un cupón real.'));

syncExtraState();

