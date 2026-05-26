# abrir archivo conflicto
code .gitignore

# guardar archivo después de arreglarlo

# marcar conflicto resuelto
git add .gitignore

# terminar merge
git commit -m "resolver conflicto gitignore"

# comprobar estado
git status


# ================================
# VER ESTADO DEL REPOSITORIO
# ================================

git status

# muestra:
# - archivos modificados
# - conflictos
# - rama actual
# - archivos sin seguimiento


# ================================
# VER DIFERENCIAS
# ================================

git diff

# muestra cambios exactos antes de commit


# ================================
# GUARDAR CAMBIOS LOCALES
# ================================

git add .

# añade todos los archivos al staging


git commit -m "guardar cambios"

# crea commit local


# ================================
# ACTUALIZAR DESDE GITHUB
# ================================

git pull origin main

# descarga cambios remotos


# ================================
# CAMBIAR DE RAMA
# ================================

git branch

# ver ramas


git switch main

# cambiar a main


git switch susana

# volver a rama susana


# ================================
# CONFLICTO MERGE
# ================================

# error típico:
# CONFLICT (content)

# abrir archivo conflicto:

code .gitignore

# o:

code archivo

# buscar:

<<<<<<< HEAD
# tu versión
=======
# versión remota
>>>>>>> main

# borrar marcas y dejar código correcto

# guardar archivo


git add .gitignore

# marcar conflicto resuelto


git commit -m "resolver conflicto"

# finalizar merge


# ================================
# ABORTAR MERGE
# ================================

git merge --abort

# cancela merge roto


# ================================
# REBASE
# ================================

git pull --rebase

# actualiza historial limpio


# continuar rebase después conflicto

git add .

git rebase --continue


# cancelar rebase

git rebase --abort


# ================================
# STASH
# ================================

git stash

# guarda cambios temporalmente


git stash pop

# recupera cambios guardados


# ================================
# PUSH A GITHUB
# ================================

git push origin main

# subir rama main


git push origin susana

# subir rama susana


# ================================
# ERROR NON FAST FORWARD
# ================================

# error:
# failed to push
# non-fast-forward

git pull origin main

git push

# sincroniza y vuelve subir


# ================================
# RESET DURO
# ================================

git reset --hard origin/main

# ⚠️ BORRA cambios locales


# ================================
# LIMPIAR ARCHIVOS NO TRACKED
# ================================

git clean -fd

# ⚠️ elimina archivos no controlados


# ================================
# USAR VERSION LOCAL EN CONFLICTO
# ================================

git checkout --ours archivo

# conservar tu versión


# ================================
# USAR VERSION REMOTA
# ================================

git checkout --theirs archivo

# conservar versión github


# ================================
# VER HISTORIAL
# ================================

git log --oneline

# historial resumido


# ================================
# RECUPERAR COMMITS
# ================================

git reflog

# historial interno completo


git checkout HASH

# volver a commit específico


# ================================
# RECARGAR VS CODE
# ================================

# Ctrl + Shift + P

# escribir:
# Reload Window

# refresca explorer y git


# ================================
# INSTALAR DEPENDENCIAS
# ================================

npm install

# instala paquetes package.json


# ================================
# EJECUTAR NEXT.JS
# ================================

npm run dev

# iniciar servidor local


# ================================
# SUPABASE
# ================================

npx supabase start

# iniciar supabase local


npx supabase db push

# subir migraciones


npx supabase migration new nombre

# crear migración nueva


# ================================
# FLUJO NORMAL COMPLETO
# ================================

git status

git add .

git commit -m "cambios"

git pull origin main

npm install

npm run dev

git push origin susana