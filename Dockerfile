FROM node:12-slim as intermediate

# define build arguments
ARG SSH_PUBLIC_KEY
ARG SSH_PRIVATE_KEY

ENV NODE_ENV=production \
    PROJECT_HOME=/usr/app/ \
    BUILD_DEPS="git python openssh-server build-essential"

# create project home
RUN mkdir -p ${PROJECT_HOME}

# switch to project home directory
WORKDIR $PROJECT_HOME

# configure SSH
RUN mkdir -p /root/.ssh \
    && touch /root/.ssh/id_rsa \
    && touch /root/.ssh/id_rsa.pub

COPY .ssh/config /root/.ssh/config

# copy SSH keys
RUN echo "$SSH_PRIVATE_KEY" >> /root/.ssh/id_rsa \
    && echo "$SSH_PUBLIC_KEY" >> /root/.ssh/id_rsa.pub

# fix the permissions for SSH private key
RUN chmod 600 /root/.ssh/id_rsa \
    && chmod 600 /root/.ssh/config

# copy package.json file
COPY package*.json ${PROJECT_HOME}

# install build dependencies
RUN apt-get update > /dev/null \
    && apt-get install -y -qq --no-install-recommends ${BUILD_DEPS} > /dev/null \
    && npm i -g npm node-gyp \
    && npm install --quiet \
    && rm -rf /var/lib/apt/lists/*

# copy source code
COPY . ${PROJECT_HOME}

# build soruce code
RUN npm run build

# ---------------------------------------------- 2nd stage for the actual image ------------------------------
FROM nginx:alpine

ENV NODE_ENV=production \
    PROJECT_HOME=/usr/app

# switch to project home directory
WORKDIR $PROJECT_HOME

# clear the available sites
RUN rm /etc/nginx/conf.d/* \
    && mkdir -p ${PROJECT_HOME}/build/

# copy nginx file
COPY nginx.conf /etc/nginx/conf.d/

# forward request and error logs to docker log collector
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
	&& ln -sf /dev/stderr /var/log/nginx/error.log

# copy required files from the intermediate stage
COPY --from=intermediate $PROJECT_HOME/build $PROJECT_HOME/build

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
