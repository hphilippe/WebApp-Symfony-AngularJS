<?php
namespace Skear\ApplicationBundle\Listener;

use Doctrine\ORM\Event\LifecycleEventArgs;
use Skear\ApplicationBundle\Entity\Image;

class CacheImageListener
{
    protected $cacheManager;

    public function __construct($cacheManager)
    {
        $this->cacheManager = $cacheManager;
    }

    public function postUpdate(LifecycleEventArgs $args)
    {
        $entity = $args->getEntity();

        if ($entity instanceof Image) {
            // vider le cache des vignettes
            $this->cacheManager->remove($entity->getUploadDir());
        }
    }
}