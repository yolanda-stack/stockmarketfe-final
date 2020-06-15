pipeline {
    agent any
    tools{
        maven 'maven'
    }

    environment {
        GIT_PROJECT_ADDR="https://github.com/yolanda-stack/stockmarketfe-final.git" //项目的git地址
        JENKINS_WORKSPACE="/var/jenkins_home/workspace"                             //jenkins存放文件的地址
        PROJECT_NAME="fullstackfe"  			                                          // 项目名
        IMAGE_NAME="fullstackfe"                                                    // 镜像名一般和项目名相同
        IMAGE_ADDR="yolanda/${IMAGE_NAME}"                                          // 镜像的位置
        VERSION_ID="1.0.0"
        CREDENTIAL_ID="Dockerhub_weilei"
    }
    stages {
        stage('docker build') {
            steps{	       	    
				script {	    
                //删除所有相关容器
				def OLD_CONTAINER_ID=sh(returnStdout:true,script:"sudo docker ps -aq --filter name=${IMAGE_NAME}")
				echo "OLD_CONTAINER_ID:${OLD_CONTAINER_ID}"			
				if(OLD_CONTAINER_ID){	
					echo 'delete old container'	
					sh 'sudo docker rm -f $(sudo docker ps -aq --filter name="${IMAGE_NAME}")'
				}
				//删除所有相关镜像			
				def OLD_IMAGE_ID=sh(returnStdout:true,script:"sudo docker image ls -q ${IMAGE_NAME}")
				echo "OLD_IMAGE_ID:${OLD_IMAGE_ID}"			
				if(OLD_IMAGE_ID){
					echo 'delete old image'	
					sh 'sudo docker rmi -f $(sudo docker image ls -q ${IMAGE_NAME})'
				}	
				//创建镜像
				sh 'sudo docker build -t ${IMAGE_NAME}:${VERSION_ID} .'
				def NEW_IMAGE_ID=sh(returnStdout:true,script:"sudo docker image ls -q ${IMAGE_NAME}")
				echo "NEW_IMAGE_ID:${NEW_IMAGE_ID}"
				}       
            }
        }
        stage('run') {
            // 在应用服务器节点 test
            agent any
            options {
                // 不让它切换到节点上自动从仓库拉取项目
                skipDefaultCheckout()
            }
            steps {  
	       script {	    
                echo 'pull image and docker run'
                withEnv(['JENKINS_NODE_COOKIE=dontKillMe']) {
		   //删除所有相关容器
		    def OLD_CONTAINER_ID=sh(returnStdout:true,script:"sudo docker ps -aq --filter name=${IMAGE_NAME}")
		    echo "OLD_CONTAINER_ID:${OLD_CONTAINER_ID}"			
		    if(OLD_CONTAINER_ID){	
		        echo 'delete old container'	
                        sh 'sudo docker rm -f $(docker ps -aq --filter name="${IMAGE_NAME}")'
		    }
       //启动镜像生成容器	
		   sh 'sudo docker run --name "${IMAGE_NAME}" --restart=always -p 80:80 --network stockmarket-network -d ${IMAGE_NAME}:${VERSION_ID}'
					
                }
		}
            }
        }
    }
}
